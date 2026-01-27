import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, ChevronLeft, HelpCircle } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
}

const FAQ: React.FC = () => {
    const navigate = useNavigate();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const faqData: FAQItem[] = [
        {
            question: 'How long does delivery take?',
            answer: 'Delivery usually takes 2–4 business days. For orders placed in metro cities, delivery may be completed within 1–2 business days. We provide tracking information once your order is dispatched.'
        },
        {
            question: 'Can I return a product?',
            answer: 'Yes, products can be returned within 7 days if unused and in original condition. The product packaging should be intact, and all tags must be attached. Please contact our support team to initiate a return.'
        },
        {
            question: 'Is online payment safe?',
            answer: 'Yes, all payments are secured via Razorpay with industry-standard encryption. We use SSL certificates and comply with PCI DSS standards to ensure your payment information is completely secure.'
        },
        {
            question: 'How do I track my order?',
            answer: 'You can track your order from the Profile/Orders section after purchase. Once your order is dispatched, you will receive a tracking ID via email and SMS that you can use to monitor delivery status in real-time.'
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets through our Razorpay payment gateway. You can choose your preferred payment method at checkout.'
        },
        {
            question: 'Do you offer Cash on Delivery (COD)?',
            answer: 'Currently, we only accept online payments to ensure faster processing and delivery. This also helps us maintain competitive pricing and offer better deals to our customers.'
        },
        {
            question: 'How can I contact customer support?',
            answer: 'You can reach us through our Contact Us page, email us at support@petkart.com, or call us at +91 9481519084 during business hours (Mon-Fri: 9 AM - 6 PM, Sat: 10 AM - 4 PM).'
        },
        {
            question: 'Are the products suitable for all pet breeds?',
            answer: 'Most of our products are suitable for all breeds, but we recommend checking the product description for specific breed recommendations. If you have questions about a particular product, feel free to contact our team.'
        }
    ];

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

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
                        <HelpCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tight">
                        Frequently Asked <span className="aura-gradient-text">Questions</span>
                    </h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        Find answers to common questions about our products, delivery, returns, and more.
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4 animate-fade-in [animation-delay:200ms]">
                    {faqData.map((faq, index) => (
                        <div
                            key={index}
                            className="glass rounded-2xl border border-white/5 overflow-hidden transition-all hover:border-white/10"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-6 py-5 flex items-center justify-between text-left transition-colors hover:bg-white/5"
                            >
                                <h3 className="text-lg font-bold text-white pr-4">
                                    {faq.question}
                                </h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                    }`}
                            >
                                <div className="px-6 pb-5 pt-2">
                                    <p className="text-zinc-400 leading-relaxed">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Contact CTA */}
                <div className="mt-12 md:mt-16 glass p-8 rounded-3xl border border-white/5 text-center animate-fade-in [animation-delay:400ms]">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Still have questions?
                    </h3>
                    <p className="text-zinc-400 mb-6">
                        Our support team is here to help. Reach out to us anytime.
                    </p>
                    <button
                        onClick={() => navigate('/contact')}
                        className="aura-btn px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Contact Support
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FAQ;
