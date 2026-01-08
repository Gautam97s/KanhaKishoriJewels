import React from 'react';

export default function ShippingReturnsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Shipping & Returns</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-serif mb-4">Shipping Information</h2>
                <div className="space-y-4 leading-relaxed text-stone-600">
                    <p>
                        We are pleased to offer complimentary insured shipping on all orders over $500 within the United States.
                        For orders under $500, a flat rate of $25 is applied for secure shipping.
                    </p>
                    <p>
                        All shipments are fully insured and require a signature upon delivery to ensure your jewelry arrives safely.
                        We primarily use FedEx or UPS for domestic shipments.
                    </p>
                    <h3 className="font-bold text-stone-800 mt-4">International Shipping</h3>
                    <p>
                        We ship internationally to most countries. International shipping rates are calculated at checkout based on the destination
                        and value of the package. Please note that customers are responsible for any customs duties, taxes, or import fees
                        charged by their country.
                    </p>
                    <h3 className="font-bold text-stone-800 mt-4">Delivery Times</h3>
                    <ul className="list-disc ml-5 space-y-2">
                        <li><strong>In-Stock Items:</strong> Ships within 1-2 business days.</li>
                        <li><strong>Made-to-Order:</strong> Ships within 2-3 weeks.</li>
                        <li><strong>Custom Pieces:</strong> Timeline will be provided during improved consultation (typically 4-6 weeks).</li>
                    </ul>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-serif mb-4">Returns & Exchanges</h2>
                <div className="space-y-4 leading-relaxed text-stone-600">
                    <p>
                        We want you to be completely delighted with your purchase. If for any reason you are not satisfied,
                        we accept returns for a full refund or exchange within 30 days of delivery.
                    </p>
                    <p>
                        To be eligible for a return, the item must be:
                    </p>
                    <ul className="list-disc ml-5 space-y-2">
                        <li>Unworn and in its original condition.</li>
                        <li>Returned with all original packaging, certificates, and documentation.</li>
                        <li>Free from any scratches, resizing, or alterations.</li>
                    </ul>
                    <p className="mt-4">
                        <strong>Non-Returnable Items:</strong> Custom-designed pieces and items that have been engraved or modified
                        at the customer's request are final sale and cannot be returned.
                    </p>
                    <div className="bg-stone-50 p-6 rounded mt-6 border border-stone-200">
                        <h3 className="font-bold text-stone-800 mb-2">How to Return</h3>
                        <p>
                            To initiate a return, please contact our concierge team at <a href="mailto:returns@kanhaandkishori.com" className="text-gold-600 hover:underline">returns@kanhaandkishori.com</a>.
                            We will provide you with a prepaid shipping label and instructions for safely packing your item.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
