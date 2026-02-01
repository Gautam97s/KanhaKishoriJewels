import React from 'react';

export default function AccessibilityPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Accessibility Statement</h1>

            <div className="space-y-6 text-stone-600 leading-relaxed">
                <p>
                    Kanha & Kishori is committed to ensuring digital accessibility for people with disabilities. We are continually improving the
                    user experience for everyone and applying the relevant accessibility standards.
                </p>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">Conformance Status</h2>
                    <p>
                        The <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline">Web Content Accessibility Guidelines (WCAG)</a> defines
                        requirements for designers and developers to improve accessibility for people with disabilities. It defines three levels of conformance:
                        Level A, Level AA, and Level AAA. Kanha & Kishori is partially conformant with WCAG 2.1 level AA. Partially conformant means that
                        some parts of the content do not fully conform to the accessibility standard.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-stone-800 mb-3">Feedback</h2>
                    <p>
                        We welcome your feedback on the accessibility of Kanha & Kishori. Please let us know if you encounter accessibility barriers on our website:
                    </p>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                        <li><strong>Email:</strong> <a href="mailto:accessibility@kanhaandkishori.com" className="text-gold-600 hover:underline">kanhaandkishorijewels@gmail.com</a></li>
                    </ul>
                    <p className="mt-2">We try to respond to feedback within 2 business days.</p>
                </section>
            </div>
        </div>
    );
}
