import {createFileRoute} from '@tanstack/react-router';
import {pageHead} from '@/lib/catalogue';
import {LegalPage} from '@/components/legal-page';
import {SUPPORT_EMAIL,SITE_DOMAIN,SELLER_NAME,SELLER_ADDRESS} from '@/lib/site';
export const Route=createFileRoute('/privacy-policy')({head:()=>pageHead('Privacy policy','How Nanhaa collects, uses, shares, protects and deletes your personal data.'),component:()=><LegalPage title="Privacy policy" intro={`This policy explains how Nanhaa (${SITE_DOMAIN} and the Nanhaa Android app) handles your personal data. By using Nanhaa you agree to this policy.`} sections={[
['Data we collect',['Account data: name, email address, phone number and password (stored securely by our authentication provider; we never see your password).','Order data: delivery addresses, PIN code, items ordered, order and refund history.','Content you provide: reviews, support messages, wishlist, bag and back-in-stock requests.','Technical data: basic device/browser information and error logs needed to keep the app working. We do not collect precise GPS location, contacts, photos from your device, or payment card details.']],
['How we use data',['To create your account, process and deliver Cash on Delivery orders, handle returns and refunds, provide support, send in-app order notifications, prevent fraud and comply with Indian law.','Promotional notifications are sent only if you turn them on in Privacy settings.']],
['Sharing',['We share only what is needed with delivery partners and approved suppliers who fulfil your order (name, address, phone, items), and with service providers that host our app and data. We do not sell your personal data.','We may disclose data when required by law or a valid government request.']],
['Payments',['Currently all orders are Cash on Delivery. We do not collect or store card, UPI or bank details for purchases. For COD refunds you may share bank details through support only for that refund.']],
['Security & retention',['Data is encrypted in transit and access is restricted by role. Account data is kept while your account is active. Order and financial records are kept in anonymized form as required by tax and accounting laws.']],
['Your rights & account deletion',[`You can view and update your profile and addresses, change notification preferences, and delete your account in the app (Account → Privacy) or by visiting nanhaa.store/delete-account. You may also email ${SUPPORT_EMAIL}.`]],
['Children',['Nanhaa is not directed at children under 18. Accounts must be created by adults.']],
['Grievance officer',[`Under the Information Technology Act, 2000 and Consumer Protection (E-Commerce) Rules, 2020, grievances can be sent to ${SUPPORT_EMAIL}. We acknowledge within 48 hours and aim to resolve within 30 days.`]],
['Seller details',[`${SELLER_NAME}, ${SELLER_ADDRESS}.`]],
['Changes',['We will post updates on this page and change the "Last updated" date.']]]}/>});
