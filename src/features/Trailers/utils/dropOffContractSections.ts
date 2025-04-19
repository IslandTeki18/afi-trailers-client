import { ContractSection } from "../types/contract.types";

export const contractFullServiceSections: ContractSection[] = [
  {
    title: "1. Rental Terms",
    formalText: [
      "The rental period begins on [START DATE] at [START TIME] and ends on [END DATE] at [END TIME].",
      "The Owner will deliver the trailer to the Renter’s specified location at [DROP-OFF LOCATION].",
      "The Renter agrees to pay the following rental fees:",
      "Half Day Rental (5 hours): $60",
      "Full Day Rental (24 hours): $100",
      "A delivery and pick-up fee of $20 applies for the drop-off service.",
      "If the rental period exceeds 24 hours, the rental fee will be automatically calculated based on 24-hour increments at the full day rate of $100 per day.",
    ],
    simpleExplanation:
      "The rental starts on [START DATE] at [START TIME] and ends on [END DATE] at [END TIME], with the Owner delivering to [DROP-OFF LOCATION]. Rental fees are $60 for a half day (5 hours) and $100 for a full day (24 hours). Delivery fee of $20 will be charged. Rentals longer than 24 hours are charged $100 per additional day.",
  },
  {
    title: "2. Renter Responsibilities",
    formalText: [
      "The Owner will deliver the trailer at the agreed-upon time and location.",
      "The Renter agrees to use the trailer only for its intended purpose and will not overload it beyond its weight capacity of 3 tonnes or 6,000lbs.",
      "The Renter will inspect the trailer upon delivery and will notify the Owner immediately of any pre-existing damage or issues.",
      "The Renter will ensure the trailer remains at the specified drop-off location and will not relocate the trailer without the Owner’s written consent.",
      "The Renter will be fully responsible for any and all damages to the trailer that occur during the rental period, including but not limited to damage to the tarp, tires, control box, axles, and doors.",
      "If the Renter violates any of the rental conditions listed below, they agree to pay a $500 fee in addition to the regular rental charges and any costs associated with repairing damages to the trailer.",
    ],
    simpleExplanation:
      "The renter has to pick up the trailer at the agreed time and place and only use it for what it’s meant for, without putting more than 3 tonnes (6,000 lbs) in it. Before using it, the renter will check the trailer and tell the owner if there’s any damage. The renter is responsible for any damage, like to the tarp, tires, control box, axles, or doors. If the renter breaks the rules, they’ll have to pay $500 plus the cost of repairs. The trailer must stay in the agreed location; if it’s moved without permission, there’s a $100 fee, and the rental could end with no refund.",
  },
  {
    title: "3. Rental Conditions",
    formalText: [
      "The Renter will be responsible for paying a $500 fee if any of the following conditions are violated:",
      "Any damage to the tarp",
      "Flat tires",
      "Damage to the control box",
      "Any axle damage",
      "Damage to the doors",
      "Overloading the trailer beyond its weight capacity, as evidenced by the dump receipt",
      "Moving the trailer without prior written consent from the Owner",
    ],
    simpleExplanation:
      "If the renter breaks any of these rules, they’ll have to pay $500: if they damage the tarp, get a flat tire, break the control box, damage the axles or doors, put too much weight in the trailer, or move the trailer without permission.",
  },
  {
    title: "4. Cancellation Policy",
    formalText: [
      "For single-day rentals, cancellations made at least 24 hours before the start of the rental period will not be charged the cancellation fee. Cancellations made within 24 hours of the start of the rental period will be charged at least 50% of the rental fee.",
      "For multi-day rentals, cancellations made at least 48 hours before the start of the rental period will receive a full refund of the security deposit. Cancellations made within 48 hours of the start of the rental period will forfeit the rental fee for the first rental day. Cancellations after the rental period has begun will forfeit the rental fee for the remaining days.",
    ],
    simpleExplanation:
      "For single-day rentals, cancellations made 24 hours in advance avoid fees, while those within 24 hours are charged at least 50% of the rental fee. For multi-day rentals, cancellations made 48 hours in advance will receive a full refund of the security deposit, but cancellations within 48 hours will forfeit the first rental day's fee, and those after the rental period begins will forfeit the remaining rental fees.",
  },
  {
    title: "5. Payment Terms",
    formalText: [
      "Payment for the rental fee, and delivery fee must be made in full at the time of booking.",
      "Accepted payment methods include cash, credit card, Venmo, and debit card.",
    ],
    simpleExplanation:
      "Payment for the rental fee must be made in full at the time of booking. Accepted payment methods are cash, credit card, venmo, and debit card.",
  },
  {
    title: "6. Inspection and Disputes",
    formalText: [
      "The Owner and Renter will inspect the trailer together at the time of delivery and after pickup to assess its condition.",
      "Any disputes regarding damages or fees will be resolved through negotiation or mediation, with the goal of reaching a fair and mutually agreeable resolution.",
    ],
    simpleExplanation:
      "The owner and renter will inspect the trailer together before and after the rental to assess its condition. Any disputes about damages or fees will be resolved through negotiation or mediation to reach a fair and mutually agreeable solution.",
  },
  {
    title: "7. Maintenance",
    formalText: [
      "The Owner is responsible for maintaining the trailer in safe and operational condition. However, the Renter is responsible for any damages or repairs necessary due to misuse or negligence during the rental period.",
      "Roadside assistance is not provided by the Owner. The Renter is responsible for arranging and paying for any necessary roadside assistance during the rental period.",
    ],
    simpleExplanation:
      "The owner is responsible for maintaining the trailer in safe working condition, but the renter is responsible for any damages or repairs caused by misuse or negligence. Roadside assistance is not provided by the owner; the renter must arrange and pay for any needed roadside assistance during the rental period.",
  },
  {
    title: "8. Prohibited Materials",
    formalText: [
      "The Renter guarantees that the Trailer will not contain any hazardous materials as defined by state or federal regulations. Placing hazardous materials or other prohibited items in the Trailer is strictly forbidden and subject to additional fees and potential legal action.",
    ],
    simpleExplanation:
      "The renter guarantees that no hazardous materials, as defined by state or federal regulations, will be placed in the trailer. Placing hazardous materials or prohibited items in the trailer is strictly forbidden and may result in additional fees and legal action.",
  },
  {
    title: "9. Liability and Indemnification",
    formalText: [
      "The Owner is not responsible for any injury, loss, or damage that may occur to the Renter or their property while using the rented Trailer. The Renter agrees to hold the Owner harmless from any claims, actions, or damages related to the use of the Trailer. The Renter further agrees to indemnify the Owner for any losses, damages, liabilities, and expenses, including reasonable attorney's fees, resulting from any misuse or breach of this Agreement by the Renter.",
    ],
    simpleExplanation:
      "The owner is not responsible for any injury, loss, or damage to the renter or their property while using the trailer. The renter agrees to hold the owner harmless from any claims or damages related to trailer use and will indemnify the owner for any losses, damages, or expenses, including attorney's fees, caused by the renter's misuse or breach of this agreement.",
  },
  {
    title: "10. Governing Law and Severability",
    formalText: [
      "This Agreement will be governed by the laws of the State of Utah. If any part of this Agreement is found to be unenforceable, it will be adjusted to be enforceable, without affecting the validity of the other provisions.",
    ],
    simpleExplanation:
      "This agreement is governed by Utah state laws. If any part of the agreement is found unenforceable, it will be adjusted to be enforceable without affecting the validity of the remaining provisions.",
  },
];
