import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { CourseStatus } from "@/generated/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    const { courseId } = await params;
    try {
        const user = await currentUser();
        if (!user || !user.email || !user.name) {
            return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
        }
        const course = await db.course.findUnique({
            where: {
                id: courseId,
                status: CourseStatus.PUBLISHED,
            }
        })

        if (!course) {
            return NextResponse.json({ error: "Course Not found" }, { status: 404 })
        }

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: courseId
                }
            }
        });


        if (purchase) {
            return NextResponse.json({ error: "You already purchased this course." }, { status: 400 });
        }


        const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [{
            quantity: 1,
            price_data: {
                currency: "MYR",
                product_data: {
                    name: course.title,
                    description: course.description!,
                },
                unit_amount: Math.round(course.price! * 100)
            }
        }];

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            },
            select: {
                stripeCustomerId: true
            }
        });

        // first time customer
        if (!stripeCustomer) {
            const customer = await stripe.customers.create({
                name: user.name,
                email: user.email,
            });

            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                }
            });
        }

        // why we need metadata?
        // when purchase go through
        // stripe will send a webhook to our server using the metadata
        // using metadata, we can identify which user purchase which course
        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomer.stripeCustomerId,
            line_items: lineItems,
            mode: "payment",
            success_url: `${process.env.APP_URL}/courses/${course.id}/?success=1`,
            cancel_url: `${process.env.APP_URL}/courses/${course.id}/?canceled=1`,
            metadata: {
                courseId: course.id,
                userId: user.id,
                amount: course.price
            }
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT]", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}