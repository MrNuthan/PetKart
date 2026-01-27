import React from 'react';
import { useNavigate } from 'react-router';
import { ChevronLeft, Shield } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
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
                        <Shield className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight">
                        Privacy <span className="aura-gradient-text">Policy</span>
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
                            At PetKart, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you visit our website and make purchases.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                        <div className="space-y-4 text-zinc-400">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Personal Information</h3>
                                <p className="leading-relaxed">
                                    When you create an account or place an order, we collect information such as your name, email address, phone number, shipping address, and billing address.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Payment Information</h3>
                                <p className="leading-relaxed">
                                    Payment details are securely processed through Razorpay. We do not store your complete credit card information on our servers. Razorpay handles all payment data in compliance with PCI DSS standards.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Usage Data</h3>
                                <p className="leading-relaxed">
                                    We automatically collect information about your device, browser type, IP address, and browsing behavior on our website to improve user experience and site functionality.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Process and fulfill your orders</li>
                            <li>Send order confirmations and shipping updates</li>
                            <li>Provide customer support</li>
                            <li>Improve our website and services</li>
                            <li>Send promotional emails (with your consent)</li>
                            <li>Prevent fraud and enhance security</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Payment Security</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            All payment transactions are processed securely through Razorpay, a PCI DSS Level 1 compliant payment gateway. Your payment information is encrypted using industry-standard SSL (Secure Socket Layer) technology. We never store your complete card details on our servers.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. Cookies are small data files stored on your device.
                        </p>
                        <p className="text-zinc-400 leading-relaxed">
                            You can control cookie preferences through your browser settings. However, disabling cookies may affect certain features of our website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Sharing and Disclosure</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            We do not sell or rent your personal information to third parties. We may share your data with:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Shipping partners to deliver your orders</li>
                            <li>Payment processors (Razorpay) to complete transactions</li>
                            <li>Service providers who assist in website operations</li>
                            <li>Law enforcement when required by law</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-zinc-400">
                            <li>Access the personal information we hold about you</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Data Retention</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Security Measures</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We implement industry-standard security measures including encryption, firewalls, and secure servers to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Children's Privacy</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h2>
                        <p className="text-zinc-400 leading-relaxed">
                            We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on this page and updating the "Last Updated" date.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                        <p className="text-zinc-400 leading-relaxed mb-4">
                            If you have any questions or concerns about this Privacy Policy or how we handle your data, please contact us:
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

export default PrivacyPolicy;
