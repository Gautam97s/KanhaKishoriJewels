import React from 'react';

export default function SizeGuidePage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Size Guide</h1>

            <section className="mb-12">
                <h2 className="text-2xl font-serif mb-4">Ring Sizing</h2>
                <p className="mb-6 leading-relaxed text-stone-600">
                    Finding the perfect fit is essential. We recommend having your finger measured professionally at a local jeweler
                    for the most accurate size. However, you can also use our guide below for reference.
                </p>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-100 text-stone-700">
                                <th className="p-4 border-b border-stone-200">US & Canada</th>
                                <th className="p-4 border-b border-stone-200">UK & Australia</th>
                                <th className="p-4 border-b border-stone-200">Inside Circle (mm)</th>
                            </tr>
                        </thead>
                        <tbody className="text-stone-600">
                            {[
                                { us: '4', uk: 'H 1/2', mm: '14.9' },
                                { us: '4.5', uk: 'I 1/2', mm: '15.3' },
                                { us: '5', uk: 'J 1/2', mm: '15.7' },
                                { us: '5.5', uk: 'K 1/2', mm: '16.1' },
                                { us: '6', uk: 'L 1/2', mm: '16.5' },
                                { us: '6.5', uk: 'M', mm: '16.9' },
                                { us: '7', uk: 'N', mm: '17.3' },
                                { us: '7.5', uk: 'O', mm: '17.7' },
                                { us: '8', uk: 'P', mm: '18.1' },
                                { us: '8.5', uk: 'Q', mm: '18.5' },
                                { us: '9', uk: 'R', mm: '19.0' },
                            ].map((row, i) => (
                                <tr key={row.us} className={i % 2 === 0 ? 'bg-white' : 'bg-stone-50'}>
                                    <td className="p-4 border-b border-stone-100">{row.us}</td>
                                    <td className="p-4 border-b border-stone-100">{row.uk}</td>
                                    <td className="p-4 border-b border-stone-100">{row.mm}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-serif mb-4">Necklace Lengths</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-4 text-stone-600">
                        <div className="border-b border-stone-100 pb-2">
                            <span className="font-bold block text-stone-800">14" - Collar</span>
                            <span>Fits tightly around the neck.</span>
                        </div>
                        <div className="border-b border-stone-100 pb-2">
                            <span className="font-bold block text-stone-800">16" - Choker</span>
                            <span>Sits at the base of the neck (on the collarbone).</span>
                        </div>
                        <div className="border-b border-stone-100 pb-2">
                            <span className="font-bold block text-stone-800">18" - Princess</span>
                            <span>Sits on the collarbone; the most common length.</span>
                        </div>
                        <div className="border-b border-stone-100 pb-2">
                            <span className="font-bold block text-stone-800">20" - Matinee</span>
                            <span>Sits just below the collarbone.</span>
                        </div>
                        <div className="border-b border-stone-100 pb-2">
                            <span className="font-bold block text-stone-800">24" - Opera</span>
                            <span>Sits at the center of the bust.</span>
                        </div>
                    </div>
                    <div className="bg-stone-100 rounded-lg h-64 flex items-center justify-center text-stone-400">
                        {/* Placeholder for an image illustration */}
                        <p>Illustration of Necklace Lengths</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
