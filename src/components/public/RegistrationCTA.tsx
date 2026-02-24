import { Button } from "@/components/ui/button";
import { FileDown, Phone } from "lucide-react";
import Link from "next/link";

export default function RegistrationCTA() {
    return (
        <section className="section-spacing bg-gradient-to-br from-accent via-accent-dark to-orange-700 text-white relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

            <div className="container-custom relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="heading-2 mb-6">
                        Ready to Start Your Success Journey?
                    </h2>
                    <p className="body-large text-white/90 mb-10 max-w-2xl mx-auto">
                        Join thousands of successful students who achieved their dreams with NGIT.
                        Limited seats available for the upcoming batch.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/register">
                            <Button className="bg-white text-accent hover:bg-gray-100 px-10 py-6 text-lg shadow-extra font-bold">
                                Apply Now
                            </Button>
                        </Link>
                        <Link href="/prospectus.pdf" target="_blank">
                            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-accent px-10 py-6 text-lg font-bold">
                                <FileDown className="w-5 h-5 mr-2" />
                                Download Brochure
                            </Button>
                        </Link>
                        <Link href="tel:+919876543210">
                            <Button variant="ghost" className="text-white hover:bg-white/10 px-8 py-6 text-lg font-bold">
                                <Phone className="w-5 h-5 mr-2" />
                                Call Now
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                        <div className="text-center">
                            <div className="text-3xl font-heading font-bold mb-2">15+</div>
                            <p className="text-sm text-white/80">Years Experience</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-heading font-bold mb-2">5000+</div>
                            <p className="text-sm text-white/80">Students Trained</p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-heading font-bold mb-2">98%</div>
                            <p className="text-sm text-white/80">Success Rate</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
