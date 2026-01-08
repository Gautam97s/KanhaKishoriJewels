import React from 'react';

export default function WarrantyPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Warranty & Care</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-serif mb-4">Our Lifetime Warranty</h2>
                <p className="mb-4 leading-relaxed text-stone-600">
                    At Kanha & Kishori, we stand behind the quality and craftsmanship of our jewelry.
                    We offer a free lifetime warranty against manufacturing defects on all our fine jewelry.
                </p>
                <p className="mb-4 leading-relaxed text-stone-600">
                    If you believe your item has a manufacturing defect, you may return it to us for inspection.
                    If we determine your merchandise is damaged due to a manufacturing defect, we will repair the merchandise
                    or, if we deem appropriate, replace the item.
                </p>
                <div className="bg-stone-50 p-6 rounded border border-stone-100">
                    <h3 className="font-bold text-stone-800 mb-2">What is Covered</h3>
                    <ul className="list-disc ml-5 space-y-1 text-stone-600">
                        <li>Broken clasps or jump rings due to manufacturing faults.</li>
                        <li>Loose diamonds or gemstones caused by prong failure (not damage).</li>
                        <li>Structural defects in the metal casting.</li>
                    </ul>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-serif mb-4">What is Not Covered</h2>
                <p className="mb-4 leading-relaxed text-stone-600">
                    Our warranty does not cover normal wear and tear, or damage resulting from abuse, neglect, or lack of care.
                </p>
                <ul className="list-disc ml-5 space-y-2 text-stone-600">
                    <li>Discoloration due to exposure to chemicals, make-up, swimming pools, hot tubs, or bathing.</li>
                    <li>Prongs and precious metals, which wear over time and may require restoration work as part of normal wear.</li>
                    <li>Bent, caught, or worn out prongs allowing a stone to fall out or be lost due to normal wear or other damage.</li>
                    <li>Lost inclusions or stone loss due to chipping or breaking caused by normal wear or other damage.</li>
                </ul>
            </section>

            <section>
                <h2 className="text-2xl font-serif mb-4">Care Instructions</h2>
                <div className="space-y-4 text-stone-600">
                    <p>
                        Fine jewelry is delicate and should be cared for accordingly. To extend the life of your jewelry and keep it looking its best,
                        please follow these care instructions:
                    </p>
                    <ul className="list-disc ml-5 space-y-2">
                        <li><strong>Remove Jewelry During Activities:</strong> Avoid wearing jewelry while doing manual labor, gardening, cleaning, or exercising.</li>
                        <li><strong>Avoid Chemicals:</strong> Keep jewelry away from household chemicals, perfumes, lotions, and hairspray.</li>
                        <li><strong>Storage:</strong> Store your jewelry individually in a soft pouch or lined jewelry box to prevent scratching.</li>
                        <li><strong>Cleaning:</strong> Clean with warm water, mild soap, and a soft brush. Avoid ultrasonic cleaners for porous gemstones like pearls, emeralds, or opals.</li>
                    </ul>
                </div>
            </section>
        </div>
    );
}
