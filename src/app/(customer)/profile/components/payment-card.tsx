export function PaymentCard() {
  const paymentBrands = ["Western Union", "GPay", "Mastercard", "Visa"];

  return (
    <section className="rounded-tl-4xl rounded-bl-4xl bg-card p-5 shadow-sm md:p-6">
      <h3 className="type-h3 font-semibold text-foreground">Payment data</h3>
      <p className="type-body-sm mt-3 text-muted-foreground">Card number:</p>
      <div className="type-body-sm mt-2 rounded-full bg-secondary px-4 py-2 text-muted-foreground">
        236 ** ** ** 265
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {paymentBrands.map((brand) => (
          <div
            key={brand}
            className="type-body-sm flex h-12 items-center justify-center rounded-xl border border-border bg-card font-medium text-foreground"
          >
            {brand}
          </div>
        ))}
      </div>
    </section>
  );
}
