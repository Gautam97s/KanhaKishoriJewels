import React from 'react';

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl text-stone-800">
            <h1 className="font-serif text-4xl mb-8 text-stone-900 border-b border-gold-200 pb-4">Contact Us</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    <h2 className="text-2xl font-serif mb-4">Get in Touch</h2>
                    <p className="mb-6 leading-relaxed">
                        We would love to hear from you. Whether you have a question about our jewelry,
                        need assistance with an order, or just want to share your feedback, we are here to help.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg mb-1">Email</h3>
                            <p className="text-stone-600">kanhaandkishorijewels@gmail.com</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Address</h3>
                            <p className="text-stone-600">
                                Dwarka Sector 8<br />
                                New Delhi, 110075
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Hours</h3>
                            <p className="text-stone-600">Mon-Sat: 10am - 7pm</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-stone-100">
                    <h2 className="text-2xl font-serif mb-6">Send a Message</h2>
                    <form className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-gold-400 focus:border-gold-400 outline-none"
                                placeholder="Your Name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                            <input
                                type="email"
                                id="email"
                                className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-gold-400 focus:border-gold-400 outline-none"
                                placeholder="your@email.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-1">Message</label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full px-4 py-2 border border-stone-300 rounded focus:ring-1 focus:ring-gold-400 focus:border-gold-400 outline-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>
                        <button
                            type="button"
                            className="w-full bg-stone-900 text-white py-3 px-6 rounded hover:bg-stone-800 transition-colors uppercase tracking-wider text-sm"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
