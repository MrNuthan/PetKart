import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
                        <FileText className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight">
                        Terms of <span className="aura-gradient-text">Service</span>
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
                            Welcome to PetKart. By accessing and using our website and services, you agree to be bound by these Terms of Service. Please read them carefully before making any purchase or creating an account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Account Usage</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                To access certain features, you may be required to create an account. You are responsible for:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Maintaining the confidentiality of your account credentials</li>
                                <li>All activities that occur under your account</li>
                                <li>Providing accurate and up-to-date information</li>
                                <li>Notifying us immediately of any unauthorized access</li>
                            </ul>
                            <p className="leading-relaxed">
                                You must be at least 18 years old to create an account and make purchases on PetKart.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Orders and Payments</h2>
                        <div className="space-y-4 text-zinc-400">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Order Acceptance</h3>
                                <p className="leading-relaxed">
                                    All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order for any reason, including product unavailability, pricing errors, or suspected fraudulent activity.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Payment Processing</h3>
                                <p className="leading-relaxed">
                                    All payments are processed securely through Razorpay. We accept major credit/debit cards, UPI, net banking, and digital wallets. Payment must be received in full before order dispatch.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Pricing</h3>
                                <p className="leading-relaxed">
                                    Product prices are listed in Indian Rupees (INR) and are subject to change without notice. We strive to ensure pricing accuracy, but errors may occur. If a pricing error is discovered, we will contact you before processing your order.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Shipping and Delivery</h2>
                        <div className="space-y-4 text-zinc-400">
                            <p className="leading-relaxed">
                                We deliver to addresses across India. Delivery timeframes:
                            </p>
                            <ul className="list-disc list-inside space-y-2">
                                <li>Metro cities: 1–2 business days</li>
                                <li>Other locations: 2–4 business days</li>
                            </ul>
                            <p className="leading-relaxed">
                                Delivery times are estimates and may vary due to factors beyond our control. We are not liable for delays caused by courier services, natural disasters, or other unforeseen circumstances.
                            </p>
                            <p className="leading-relaxed">
                                You will receive tracking information once your order is dispatched.
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Returns and Refunds</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We accept returns within 7 days of delivery for products that are:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400 mb-4">
                            <li>Unused and in original condition</li>
                            <li>In original packaging with all tags attached</li>
                            <li>Not damaged or altered</li>
                        </ul>
                        <p className="text-zinc-400 leading-relaxed">
                            For detailed information, please refer to our <span className="text-primary cursor-pointer" onClick={() => navigate('/refund-policy')}>Refund Policy</span>.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">User Responsibilities</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            When using PetKart, you agree to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Provide accurate and truthful information</li>
                            <li>Use the website for lawful purposes only</li>
                            <li>Not engage in fraudulent activities</li>
                            <li>Not attempt to interfere with website functionality or security</li>
                            <li>Not use automated systems (bots) to access our services</li>
                            <li>Respect intellectual property rights</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Product Information</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We make every effort to display product images and descriptions accurately. However, we do not guarantee that colors, features, or specifications are 100% accurate. We recommend reading product descriptions carefully and contacting support if you have questions.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            All content on PetKart, including text, graphics, logos, images, and software, is the property of PetKart or its content suppliers and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or modify any content without our written permission.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            To the fullest extent permitted by law, PetKart shall not be liable for:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Loss of profits, data, or business opportunities</li>
                            <li>Damages resulting from unauthorized access to your account</li>
                            <li>Issues arising from third-party services (shipping, payment processors)</li>
                            <li>Product performance beyond our control</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Indemnification</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            You agree to indemnify and hold PetKart harmless from any claims, damages, losses, or expenses arising from your use of our services, violation of these Terms, or infringement of any third-party rights.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Termination</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We reserve the right to suspend or terminate your account at any time, without prior notice, if you violate these Terms or engage in fraudulent or harmful activities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Governing Law</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to Terms</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We may update these Terms of Service from time to time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            If you have questions about these Terms of Service, please contact us:
                        </p>
                        <div className="space-y-2 text-zinc-400">
                            <p><strong className="text-white">Email:</strong> support@petkart.com</p>
                            <p><strong className="text-white">Phone:</strong> +91 9481519084</p>
                            <p><strong className="text-white">Address:</strong> PetKart, 2nd Floor, MG Road, Bengaluru, Karnataka – 560001, India</p>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
