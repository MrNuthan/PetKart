import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, RefreshCw } from 'lucide-react';

const RefundPolicy: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-24 pb-20 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-zinc-500 hover:text-white transition-colors mb-6 md:mb-8 group text-sm"
                >
                    <ChevronLeft className="w-4 h-4 mr-1 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-12 md:mb-16 animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-2xl mb-6">
                        <RefreshCw className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight">
                        Refund <span className="aura-gradient-text">Policy</span>
                    </h1>
                    <p className="text-zinc-400 text-sm">
                        Last Updated: January 24, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="glass p-8 md:p-12 rounded-3xl border border-white/5 space-y-8 animate-fade-in [animation-delay:200ms]">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            At PetKart, customer satisfaction is our priority. This Refund Policy outlines the conditions under which we accept returns and process refunds. Please read this policy carefully before making a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Eligibility for Refunds</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You are eligible for a refund if:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>The product was delivered damaged or defective</li>
                            <li>You received the wrong product</li>
                            <li>The product does not match the description on our website</li>
                            <li>You initiate a return within 7 days of delivery</li>
                            <li>The product is unused, unwashed, and in its original condition</li>
                            <li>All original tags, labels, and packaging are intact</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Return Window</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We accept returns within <strong className="text-white">7 days</strong> from the date of delivery. Returns initiated after this period will not be accepted. The return window starts from the delivery date as per the courier tracking information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Non-Refundable Items</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            The following items are not eligible for return or refund:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Pet food and treats (for hygiene and safety reasons)</li>
                            <li>Grooming products that have been opened or used</li>
                            <li>Products marked as "Final Sale" or "Non-Returnable"</li>
                            <li>Customized or personalized items</li>
                            <li>Products without original packaging or missing tags</li>
                            <li>Items damaged due to misuse or negligence</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">How to Request a Refund</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                To initiate a return and refund, follow these steps:
                            </p>
                            <ol className="list-decimal list-inside space-y-3 ml-4">
                                <li>
                                    <strong className="text-white">Contact our support team</strong> within 7 days of delivery via email at support@petkart.com or call +91 9481519084.
                                </li>
                                <li>
                                    <strong className="text-white">Provide order details</strong> including your order number, reason for return, and photos of the product (if damaged or defective).
                                </li>
                                <li>
                                    <strong className="text-white">Await approval</strong>. Our team will review your request and notify you within 24-48 hours.
                                </li>
                                <li>
                                    <strong className="text-white">Ship the product back</strong> using the shipping label provided (if applicable). Pack the product securely in its original packaging.
                                </li>
                                <li>
                                    <strong className="text-white">Confirmation</strong>. Once we receive and inspect the returned product, we will process your refund.
                                </li>
                            </ol>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Return Shipping Costs</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                Return shipping costs depend on the reason for return:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong className="text-white">Defective/Damaged Products:</strong> We will cover the return shipping costs and provide a prepaid shipping label.</li>
                                <li><strong className="text-white">Wrong Product Sent:</strong> We will cover the return shipping costs.</li>
                                <li><strong className="text-white">Change of Mind:</strong> You are responsible for return shipping costs.</li>
                            </ul>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Refund Processing Time</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                Once we receive and inspect your returned product:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Approval notification will be sent within 1-2 business days</li>
                                <li>Refund will be initiated within 3-5 business days</li>
                                <li>The refund will be credited to your original payment method</li>
                                <li>It may take 5-10 business days for the refund to reflect in your account, depending on your bank or payment provider</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                You will receive an email confirmation once the refund has been processed.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Exchanges</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Currently, we do not offer direct product exchanges. If you wish to exchange a product, please initiate a return for a refund and place a new order for the desired item.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Damaged or Defective Products</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            If you receive a damaged or defective product, please contact us immediately with photos of the product and packaging. We will arrange for a replacement or full refund at no additional cost to you.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cancellations</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                You can cancel your order before it is dispatched:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li><strong className="text-white">Before Dispatch:</strong> Full refund will be processed within 3-5 business days</li>
                                <li><strong className="text-white">After Dispatch:</strong> Cancellation is not possible. You must follow the return process once you receive the product</li>
                            </ul>
                            <p className="leading-relaxed mt-4">
                                To cancel an order, contact support@petkart.com or call +91 9481519084 immediately.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Partial Refunds</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            In certain situations, partial refunds may be granted:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Products with visible signs of use or damage</li>
                            <li>Products returned more than 7 days after delivery</li>
                            <li>Products missing components or accessories</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Questions and Support</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            If you have any questions about our Refund Policy or need assistance with a return, please contact us:
                        </p>
                        <div className="space-y-2 text-zinc-400">
                            <p><strong className="text-white">Email:</strong> support@petkart.com</p>
                            <p><strong className="text-white">Phone:</strong> +91 9481519084</p>
                            <p><strong className="text-white">Address:</strong> PetKart, 2nd Floor, MG Road, Bengaluru, Karnataka – 560001, India</p>
                            <p><strong className="text-white">Business Hours:</strong> Monday-Friday: 9 AM - 6 PM, Saturday: 10 AM - 4 PM</p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Policy Updates</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We reserve the right to update this Refund Policy at any time. Changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;
