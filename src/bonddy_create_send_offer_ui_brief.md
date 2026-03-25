# Bonddy UI Brief — Create & Send Booking Offer Modal

## 1. Goal
Design the **Buddy-side modal** used after chat negotiation is completed.

Context:
- Buddy and Traveler discuss the trip in chat
- after both sides agree on schedule, guests, and price, Buddy clicks **Create Booking**
- the system opens a modal for Buddy to create the **final booking offer**
- when Buddy submits, the offer is sent into chat for Traveler review

This brief is only for the **Create & Send Offer modal UI**, not for the Traveler approval/payment screen.

---

## 2. UX Direction
Do **not** design this as a raw admin CRUD form.
Design it as a **clean final offer modal** for a travel/local experience product.

Desired feeling:
- conversational
- trustworthy
- polished
- modern marketplace style
- human, not back-office

Visual direction:
- rounded modal and card corners
- generous spacing
- grouped sections
- simple outline icons where helpful
- strong hierarchy for total price
- right-side preview should look like a real chat offer card

---

## 3. Modal Layout
Use a **2-column desktop modal**.

### Desktop
- Left column: form fields
- Right column: live preview card

### Mobile / small screens
- Stack vertically
- Form first
- Preview below

The modal should feel structured, not like one long uncontrolled form.

---

## 4. Modal Header
### Title
**Create final booking offer**

### Subtitle
`This offer will be sent to the traveler in chat for review and payment.`

### Top-right action
- close icon button

---

## 5. Form Sections (Left Column)
Group the backend entity into 5 sections.

### A. Schedule
Backend fields:
- `bookedDate`
- `bookedStartTime`
- `bookedDurationHours`

UI:
- date picker
- time picker
- duration input/select

Labels:
- Date
- Start time
- Duration

---

### B. Guests
Backend fields:
- `bookedAdults`
- `bookedChildren`

UI:
- number stepper or compact number input

Labels:
- Adults
- Children

---

### C. Price
Backend fields:
- `price`
- `currency`

UI:
- large main price input
- small currency select next to it

Label:
- Total price

Price block should be visually emphasized more than regular fields.

---

### D. What’s included
Backend fields:
- `includes`
- `excludes`

UI:
- multiline textarea for both
- placeholder examples encouraged

Labels:
- Includes
- Excludes

---

### E. Message to traveler
Backend field:
- `noteForCustomer`

UI:
- textarea

Label:
- Message to traveler

Purpose:
This is the personal note explaining the final plan and tone of the offer.

---

## 6. Backend Payload Reference
```json
{
  "bookedDate": "2026-03-24",
  "bookedStartTime": "string",
  "bookedDurationHours": 0,
  "bookedAdults": 0,
  "bookedChildren": 0,
  "price": 0,
  "currency": "string",
  "includes": "string",
  "excludes": "string",
  "noteForCustomer": "string"
}
```

Do not expose raw backend field names in the UI.
Use user-friendly labels only.

---

## 7. Live Preview (Right Column)
Render a live preview of the card that will be sent in chat.

Preview should contain:
- Buddy name/avatar
- badge: `Final booking offer`
- date
- start time
- duration
- adults / children
- total price
- includes
- excludes
- message to traveler
- footer status: `Awaiting traveler review`

The preview should look close to a real chat card, not just a summary box.

---

## 8. CTA / Button Copy
### Primary CTA
Use:
**Send booking offer**

Alternative acceptable copy:
- Send final booking offer
- Create & send offer

Do not use:
- Create
- Save
- Submit

### Secondary CTA
- Cancel

### Success feedback
- `Booking offer sent to traveler`

---

## 9. Validation / UX Notes
Recommended behavior:
- disable primary CTA until required fields are filled
- show inline validation messages
- preserve form structure and spacing cleanly
- update preview in real time as the Buddy types

Likely required fields:
- Date
- Start time
- Duration
- Adults
- Price
- Currency

Optional depending on business rule:
- Children
- Includes
- Excludes
- Message to traveler

---

## 10. Visual/Component Notes for Code Generation
Please generate a polished production-style UI.

Recommended component style:
- modern modal
- section cards or visual grouping blocks
- clean labels
- helper text where useful
- subtle dividers
- price highlighted with stronger typography
- preview card with chat-like structure

Recommended responsive behavior:
- desktop: 2 columns
- tablet: slightly narrower 2 columns or stacked
- mobile: fully stacked

---

## 11. Final Product Language
At this step, Buddy is not just creating data.
Buddy is sending a **final booking offer** after chat discussion.

Therefore the UI language should reflect:
- **offer**
- **send**
- **traveler review**

Preferred wording:
- title: **Create final booking offer**
- main button: **Send booking offer**
- success state: **Booking offer sent to traveler**

