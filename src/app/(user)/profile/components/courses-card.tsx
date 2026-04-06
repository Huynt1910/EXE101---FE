import { COURSES } from "./profile-data";

export function CoursesCard() {
  return (
    <section className="rounded-[1.75rem] bg-background p-5 shadow-sm md:p-6">
      <h3 className="type-h3 font-semibold text-foreground">My courses</h3>

      <div className="mt-5 grid gap-3">
        {COURSES.map((course, idx) => (
          <div
            key={course.title}
            className={[
              "rounded-2xl border border-border px-4 py-3",
              idx === 0
                ? "bg-secondary/70"
                : idx === 1
                  ? "bg-accent/15"
                  : "bg-accent/10",
            ].join(" ")}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h4 className="type-title font-semibold text-foreground">
                  {course.title}
                </h4>
                <p className="type-body-sm mt-1 text-muted-foreground">
                  {course.description}
                </p>
                <p className="type-body-sm mt-1 text-muted-foreground">
                  {course.lessons}
                </p>
              </div>

              <span
                className={[
                  "type-caption rounded-full px-3 py-1 font-semibold",
                  course.statusTone === "done"
                    ? "bg-emerald-500 text-white"
                    : "bg-primary text-primary-foreground",
                ].join(" ")}
              >
                {course.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
