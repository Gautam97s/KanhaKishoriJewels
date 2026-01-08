import React from 'react';

export default function TermsOfServicePage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Terms of Service</h1>
            <p className="text-stone-500 mb-8 italic">Last Updated: January 1, 2024</p>

            <div className="space-y-8 text-stone-600 leading-relaxed">
                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">1. Agreement to Terms</h2>
                    <p>
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”)
                        and Kanha & Kishori ("we", "us", or "our"), concerning your access to and use of our website. By accessing the site, you agree that
                        you have read, understood, and agreed to be bound by all of these Terms of Service.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">2. Products</h2>
                    <p>
                        We make every effort to display as accurately as possible the colors, features, specifications, and details of the products
                        available on the Site. However, we do not guarantee that the colors, features, specifications, and details of the products
                        will be accurate, complete, reliable, current, or free of other errors, and your electronic display may not accurately reflect
                        the actual colors and details of the products.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">3. Purchases and Payment</h2>
                    <p>
                        We accept various forms of payment. You agree to provide current, complete, and accurate purchase and account information for all
                        purchases made via the Site. We reserve the right to refuse any order placed through the Site.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">4. Intellectual Property Rights</h2>
                    <p>
                        Unless otherwise indicated, the Site and its entire contents, features, and functionality (including but not limited to all information,
                        software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by us, our licensors,
                        or other providers of such material and are protected by copyright, trademark, and other intellectual property or proprietary rights laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">5. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and defined following the laws of India. Kanha & Kishori and yourself irrevocably consent that the
                        courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                    </p>
                </section>
            </div>
        </div>
    );
}
