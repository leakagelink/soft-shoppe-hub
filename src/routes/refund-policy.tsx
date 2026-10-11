import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/lib/catalogue';
import {LegalPage} from '@/components/legal-page';
import {SUPPORT_EMAIL} from '@/lib/site';
export const Route=createFileRoute('/refund-policy')({head:()=>pageHead('Cancellation, returns & refunds','How to cancel Nanhaa orders, request returns and receive COD refunds.'),component:()=><LegalPage title="Cancellation, returns & refunds" intro="We want you to love what you order. Here is how cancellations, returns and refunds work." sections={[
['Cancellation',['You can request cancellation from the order page before the order is shipped. Once shipped, please refuse delivery or request a return after delivery.']],
['Returns',['Return eligibility and the return window are shown on each product page (for example "7-day return"). Items must be unused, with original tags and packaging. Some items such as personal-care, hygiene or customised products may not be returnable; this is shown on the product page.','Request a return from the order page. Damaged or wrong items must be reported within 48 hours of delivery with photos.']],
['Refunds',['Since orders are Cash on Delivery, approved refunds are sent by bank transfer/UPI to details you share with support. Refunds are processed within 7 working days after the return is received and checked, or after an approved cancellation of a paid order.']],
['Help',[`Email ${SUPPORT_EMAIL} with your order ID.`]]]}/>});
