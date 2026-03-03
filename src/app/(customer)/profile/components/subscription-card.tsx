export function SubscriptionCard() {
  return (
    <section className="rounded-tl-4xl rounded-br-4xl bg-primary p-6 text-primary-foreground shadow-sm">
      <h3 className="type-h3 font-semibold">Success Premium</h3>
      <ul className="type-body-sm mt-4 list-disc space-y-2 pl-5 text-primary-foreground/90">
        <li>1 month Premium for free</li>
        <li>2 months for students and learners</li>
        <li>Cancel anytime</li>
        <li>Exclusive educational offers every month</li>
      </ul>
      <button
        className="type-body mt-8 w-full rounded-2xl bg-card px-4 py-3 font-semibold text-primary hover:opacity-95"
        type="button"
      >
        Subscribe
      </button>
    </section>
  );
}
