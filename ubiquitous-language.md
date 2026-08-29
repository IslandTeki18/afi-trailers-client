# Afi Trailer Rentals - Ubiquitous Language

Public-facing website for Afi Trailer Rentals, a dump trailer rental business in Spanish Fork, Utah County. The site markets the trailer, publishes pricing and rental contracts, and takes contact inquiries. Online booking is prototyped but not yet live; rentals are currently arranged by phone or the contact form.

## Language

### Fleet

**Trailer**:
A rentable piece of equipment owned by Afi. Today the fleet is a single Southland 7x14x4 dump trailer.
_Avoid_: Equipment, unit, asset

**Trailer Type**:
The category of a trailer (currently only "Dump Trailer"). Distinguishes future fleet additions.

**Maintenance Status**:
Whether a trailer can be rented: Operational, Maintenance, or Out of Service.

**Towing Requirements**:
What a Renter's vehicle must have to tow a trailer (3/4 ton pickup or larger, 2 5/16" ball hitch, 7-pin connector, 10,000 lb towing capacity).

### Parties

**Owner**:
Afi Trailer Rentals, the party that owns and rents out the trailer. This is the term used in contracts.
_Avoid_: Company, admin, we (in formal text)

**Renter**:
The person who books and is responsible for a trailer during a Rental Period. In the booking prototype this appears as "client information" or "user info".
_Avoid_: Client, customer, user

### Renting

**Booking**:
A Renter's reservation of a specific trailer for a Rental Period under a chosen Service Type. Has a status of pending, confirmed, or cancelled.
_Avoid_: Order, reservation

**Booking Request**:
A Renter's unpaid ask for a Booking, sent from the site with dates, Service Type, contact details and what they are hauling. The Owner confirms by text or call; nothing is charged until pickup or drop-off.
_Avoid_: Order, checkout, reservation request

**Quote**:
The price shown for a Booking Request before confirmation: Rental Fee plus Weekend Surcharge plus Delivery Fee. It is an estimate, not a charge.
_Avoid_: Total, invoice, bill

**Rental Period**:
The span from start date/time to end date/time during which the Renter holds the trailer.
_Avoid_: Selected dates, date range

**Booked Dates**:
The dates on a trailer's calendar already reserved by a Booking. Booked Dates are not selectable for a new Booking.

**Rental Type**:
The duration tier of a rental: Half Day (5 hours) or Full Day (24 hours). Multi-day rentals are always Full Day, billed in 24-hour increments.
_Avoid_: Rental duration, day option, pricing tier

**Service Type**:
How the trailer gets to and from the Renter: Full Service or Self Service.
_Avoid_: Service level, frequency (the pricing UI internally calls this "frequency"; do not adopt it)

**Full Service**:
The Owner delivers the trailer to the Renter's site, picks it up, dumps it, and cleans it. Carries a Delivery Fee. Its contract is the Drop-Off Contract.
_Avoid_: Drop-off service, delivery service, "FULL"

**Self Service**:
The Renter picks up the trailer at the Owner's location, fills, dumps, and returns it. The Owner cleans it. Its contract is the Drive-Off Contract.
_Avoid_: Pickup service, drive-off service, "SELF"

**Drop-Off Contract**:
The rental agreement for Full Service rentals.
_Avoid_: Full service contract

**Drive-Off Contract**:
The rental agreement for Self Service rentals. Adds a Late Return Fee clause.
_Avoid_: Self service contract

**Contract Section**:
One numbered clause of a rental contract, presented with both formal text and a plain-language explanation.

**Usage Guidelines**:
The published rules for how a trailer may be used (loading, prohibited materials, care).

### Money

**Rental Fee**:
The base price for a Rental Period, determined by Rental Type and number of days. Paid in full at booking.
_Avoid_: Rental price, rate

**Delivery Fee**:
The fee for Full Service delivery and pickup ($20).
_Avoid_: Full service surcharge, drop-off fee

**Weekend Surcharge**:
An extra per-day charge when a rental day falls on Saturday or Sunday.

**Security Deposit**:
A refundable amount held against damage. Marketing copy currently contradicts itself on whether one is required (see Open Questions).

**Late Return Fee**:
Charged to Self Service Renters who return after the Rental Period plus a 30-minute Grace Period.

**Grace Period**:
The 30 minutes after a Rental Period ends before a Late Return Fee applies.

**Violation Fee**:
The flat $500 charged when a Renter breaks a Rental Condition (tarp, tire, control box, axle, or door damage; overloading; relocating the trailer without consent).
_Avoid_: Damage fee, penalty

**Cancellation Policy**:
Single-day rentals: full refund if cancelled 24+ hours before start, otherwise 50% of the Rental Fee. Multi-day rentals: full refund if cancelled 48+ hours before start, otherwise the first day's Rental Fee is forfeited.

**Additional Fees**:
The published list of non-base charges: Security Deposit, Late Return Fee, Insurance Coverage, Cleaning Fee.

## Open Questions

Places where the code or copy disagrees with itself. Resolve these before building the booking backend.

| Term | Conflict |
|---|---|
| Full Day price | Trailer data says $80; pricing page and contracts say $100 (Full Service) / $80 (Self Service). |
| Half Day price | Trailer data says $60; pricing page says $80 (Full Service) / $60 (Self Service); contracts say $60 for both. |
| Security Deposit | FAQ says no deposit required; Additional Fees lists a $500 deposit; contracts reference a deposit refund. |
| Delivery Fee | Contract says one-time $20; booking calendar copy says "$20 per day". |
| Weight capacity | Trailer data says 10,000 lb max load; contracts say 3 tonnes / 6,000 lb. |
| Service Type codes | Code uses "full"/"self", "FULL"/"SELF", and "fullService"/"selfService" interchangeably. |
| Cleaning Fee | Additional Fees lists a $50 cleaning fee; pricing tiers say "We Clean the Trailer" as an included feature. |
