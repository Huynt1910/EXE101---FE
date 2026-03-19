import Image from "next/image";
import {
  Dribbble,
  Facebook,
  Globe,
  Instagram,
  Pencil,
  Twitter,
} from "lucide-react";

export function ProfileSummaryCard() {
  const socialIcons = [Instagram, Facebook, Twitter, Dribbble, Globe];

  return (
    <section className="relative rounded-[1.75rem] bg-card p-5 shadow-sm md:p-6">
      <button
        className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:bg-secondary"
        type="button"
      >
        <Pencil className="h-4 w-4" />
      </button>

      <div className="flex flex-col gap-5 md:flex-row">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border border-border bg-secondary">
          <Image
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80"
            alt="Profile avatar"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="min-w-0 space-y-2">
          <h2 className="type-h3 font-semibold text-foreground">
            Prokhorova Nika
          </h2>
          <p className="type-body-sm text-muted-foreground">
            Registration date:{" "}
            <span className="font-medium text-foreground">24 Nov 2022</span>
          </p>
          <p className="type-body-sm text-muted-foreground">
            Country, city:{" "}
            <span className="font-medium text-foreground">Bulgaria, Sofia</span>
          </p>
          <p className="type-body-sm text-muted-foreground">
            Birth date:{" "}
            <span className="font-medium text-foreground">08.04.1993</span>
          </p>
          <p className="type-body-sm text-muted-foreground">
            E-mail:{" "}
            <span className="font-medium text-foreground">
              proxorovanica@mail.ru
            </span>
          </p>
          <p className="type-body-sm text-muted-foreground">
            Phone:{" "}
            <span className="font-medium text-foreground">
              (+378) 265 236 25
            </span>
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            {socialIcons.map((Icon, idx) => (
              <button
                key={idx}
                className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground/95 hover:opacity-90"
                type="button"
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
