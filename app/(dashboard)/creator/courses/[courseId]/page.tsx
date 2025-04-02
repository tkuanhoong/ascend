export default  function CoursesPage({
  params,
}: {
  params: { courseId: string };
}) {
  return <div>{params.courseId}</div>;
}
