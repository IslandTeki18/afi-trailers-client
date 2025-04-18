# 🚛 Dump Trailer Booking System – TODO.md

## 🗂️ Project Structure
- [ ] Create new "Booking" model in backend
- [ ] Add booking management UI (admin dashboard or CMS integration)

---

## 🗓️ 1. Availability Calendar
- [ ] Build availability calendar component on trailer/equipment detail pages
- [ ] Display booked dates using existing bookings from backend
- [ ] Disable past dates and already booked days
- [ ] Allow selection of valid dates for booking

---

## 🧾 2. Booking Flow (User-Facing)
### A. Select Service Type
- [ ] Add step to choose:
  - [ ] Full Service (dropoff/pickup)
  - [ ] Self Service (client picks up/returns)

### B. Booking Details Form
- [ ] Pickup/Dropoff address (if Full Service)
- [ ] Pickup/Return time (if Self Service)
- [ ] Contact info (name, phone, email)
- [ ] Notes or special instructions

### C. Rental Agreement Signature
- [ ] Integrate Docusign or Eversign for agreement
- [ ] Store signed rental agreement PDF with booking
- [ ] Require signature before payment

### D. Payment Integration
- [ ] Show final price based on:
  - [ ] Service type
  - [ ] Rental duration
- [ ] Collect payment (Stripe/PayPal/etc.)
- [ ] Mark booking as "confirmed" after payment

---

## 🔗 3. Manual Booking Flow (Admin-Created URL)
- [ ] Create internal booking form (admin-facing)
- [ ] Generate a unique booking URL with token
- [ ] Auto-fill trailer, dates, and user info in URL
- [ ] Send URL to client for:
  - [ ] Agreement signature
  - [ ] Payment

---

## 🛠️ 4. Admin Features
- [ ] View all bookings in dashboard
- [ ] Manually edit or cancel bookings
- [ ] Download signed agreements
- [ ] Track trailer usage history

---

## 🧪 5. Testing
- [ ] Test full booking flow from public site
- [ ] Test self-service flow
- [ ] Test agreement + payment gate
- [ ] Test link-based manual booking

---

## 🧩 6. Optional Enhancements
- [ ] Add SMS/email confirmation with booking details
- [ ] Add Google Calendar/iCal integration for admin
- [ ] Auto-add bookings to admin dashboard calendar