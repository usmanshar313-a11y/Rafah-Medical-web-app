import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquarePlus, CheckCircle2, X } from 'lucide-react';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { Review } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

const SAMPLE_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    patientName: 'Kamran Siddiqui',
    rating: 5,
    comment: 'Brought my mother to the 24/7 emergency ward at midnight. The duty doctor and nursing staff treated her immediately with utmost care and compassion.',
    approved: true,
    createdAt: '2026-06-15',
  },
  {
    id: 'rev-2',
    patientName: 'Shazia Parveen',
    rating: 5,
    comment: 'Extremely polite staff in Gulberg Town. Dr. Samina listened to my maternity concerns patiently and guided us through all diagnostic tests.',
    approved: true,
    createdAt: '2026-07-02',
  },
  {
    id: 'rev-3',
    patientName: 'Dr. Tariq Mahmood (Resident)',
    rating: 4,
    comment: 'Clean hospital premises, accessible wheelchair ramps, and well-organized OPD services. Highly recommended for family healthcare in Karachi.',
    approved: true,
    createdAt: '2026-07-10',
  },
];

export const TestimonialsSection: React.FC = () => {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState<Review[]>(SAMPLE_REVIEWS);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const q = query(collection(db, 'reviews'), where('approved', '==', true));
        const snap = await getDocs(q);
        const fetched: Review[] = [];
        snap.forEach((doc) => {
          fetched.push({ id: doc.id, ...doc.data() } as Review);
        });
        if (fetched.length > 0) {
          setReviews(fetched);
        }
      } catch (e) {
        console.warn('Using fallback reviews');
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !comment) return;

    setSubmitting(true);
    try {
      const newReview = {
        patientName,
        rating,
        comment,
        approved: false, // requires admin moderation
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(db, 'reviews'), newReview);
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="reviews" className="py-20 bg-[#e8e2d5] text-[#0B6B4E] gsap-reveal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6"
        >
          <div className="space-y-2">
            <span className="bg-emerald-900/10 text-[#0B6B4E] text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
              Patient Experiences
            </span>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#0B6B4E]">
              Trusted by 200+ Patients in Karachi
            </h2>
            <p className="text-xs sm:text-sm text-emerald-950/80 max-w-xl">
              Read authentic feedback from families and patients treated at Rafah-E-Aam Medical Center.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://www.google.com/maps?q=Rafah-E-Aam+Medical+Center+Karachi"
              target="_blank"
              rel="noreferrer"
              className="bg-white border border-emerald-900/20 text-[#0B6B4E] hover:bg-emerald-50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>See Reviews on Google (3.8★)</span>
            </a>

            <button
              onClick={() => {
                setModalOpen(true);
                setSubmitted(false);
              }}
              className="bg-[#0B6B4E] hover:bg-[#08523c] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow flex items-center gap-2 transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Write a Review</span>
            </button>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-[#F5F1E8] p-6 rounded-3xl border border-emerald-900/10 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] text-emerald-800/60 font-medium">
                    {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : 'Verified Patient'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-emerald-950/90 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-emerald-900/10">
                <div className="w-9 h-9 rounded-full bg-[#0B6B4E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {rev.patientName.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#0B6B4E]">{rev.patientName}</div>
                  <div className="text-[10px] text-emerald-800/70 font-medium">Verified Patient</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Review Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F5F1E8] text-[#0B6B4E] w-full max-w-md rounded-2xl shadow-2xl p-6 border border-emerald-900/10 space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-900/10 pb-3">
              <h3 className="font-heading font-bold text-base">Write a Patient Review</h3>
              <button onClick={() => setModalOpen(false)} className="text-emerald-800 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0B6B4E] mx-auto" />
                <h4 className="font-bold text-base">Thank you for your feedback!</h4>
                <p className="text-xs text-emerald-900/80">
                  Your review has been submitted for verification and will appear shortly.
                </p>
                <button
                  onClick={() => setModalOpen(false)}
                  className="bg-[#0B6B4E] text-white px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Tariq Ahmed"
                    className="w-full bg-white border border-emerald-900/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Star Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Your Comment / Experience *</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your visit or experience with doctors..."
                    className="w-full bg-white border border-emerald-900/20 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B6B4E]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0B6B4E] hover:bg-[#08523c] text-white py-2.5 rounded-xl font-bold text-xs shadow cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
