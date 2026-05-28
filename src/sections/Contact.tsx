import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Mail, Phone, MapPin, Linkedin, Instagram, Github, Send, AlertCircle, CheckCircle2, Loader2, Compass 
} from "lucide-react";
import emailjs from "@emailjs/browser";
import { personalInfo, socialLinks } from "../data/portfolioData";

export default function Contact() {
  const formRef = useRef<HTMLFormElement>(null);
  const serviceId = (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID;
  const templateId = (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY;

  useEffect(() => {
    if (publicKey) {
      emailjs.init(publicKey);
      console.debug("EmailJS initialized with public key");
    }
  }, [publicKey]);
  
  // Form values state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // Action status states
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);

  // Input focus tracks to drive custom label floats
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Full Name is required";
    if (!formData.email.trim()) {
      errors.email = "Email Address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.subject.trim()) errors.subject = "Subject is required";
    if (!formData.message.trim()) {
      errors.message = "Message text is required";
    } else if (formData.message.trim().length < 10) {
      errors.message = "Message must be at least 10 characters long";
    }
    return errors;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setStatusType("error");
      setStatusMessage("Please correct all form errors first.");
      return;
    }

    setIsSending(true);
    setStatusMessage(null);
    setStatusType(null);

    console.debug("EmailJS client keys", {
      serviceId: serviceId ? "configured" : "missing",
      templateId: templateId ? "configured" : "missing",
      publicKey: publicKey ? "configured" : "missing"
    });

    // Check if configuration exists
    if (serviceId && templateId && publicKey) {
      try {
        const result = await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            user_name: formData.name,
            from_email: formData.email,
            user_email: formData.email,
            email: formData.email,
            reply_to: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: "Ranveer Singh"
          },
          publicKey
        );

        if (result.status === 200) {
          setStatusType("success");
          setStatusMessage("Message Sent Successfully");
          setFormData({ name: "", email: "", subject: "", message: "" });
        } else {
          throw new Error(`Unexpected EmailJS response status: ${result.status}`);
        }
      } catch (error: any) {
        console.error("EmailJS sending fail, fallback triggered:", error);
        setStatusType("error");
        setStatusMessage(
          error?.message
            ? `Sending failed: ${error.message}`
            : "Sending failed. Check client integrations or console for keys setup."
        );
      } finally {
        setIsSending(false);
      }
    } else {
      console.warn(
        "EmailJS credentials missing. To send production email messages, please specify:\n" +
        "VITE_EMAILJS_SERVICE_ID\n" +
        "VITE_EMAILJS_TEMPLATE_ID\n" +
        "VITE_EMAILJS_PUBLIC_KEY\n" +
        "in your local project .env file and restart the dev server."
      );

      setIsSending(false);
      setStatusType("error");
      setStatusMessage(
        "EmailJS is not configured. No message was sent. Check .env and restart Vite."
      );
    }
  };

  return (
    <section
      id="contact"
      className="relative py-28 px-6 lg:px-12 flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background glowing rings */}
      <div className="absolute bottom-[20%] right-[5%] w-[350px] h-[350px] bg-accent-blue/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[200px] h-[200px] bg-white/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-3">
              <span className="text-sm font-mono text-accent-blue tracking-widest font-semibold">05 // CONTACT</span>
              <div className="h-[1px] w-12 bg-accent-blue/30" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-[#F5F5F5] uppercase">
              SECURE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#BFC0C0]">TRANSMISSIONS</span>
            </h2>
          </div>
          <p className="text-xs font-mono text-white/30 tracking-wider">
            INITIATE ENGAGEMENT AND COLLABORATIVE DISCUSSIONS
          </p>
        </div>

        {/* Contact Split layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start text-left">
          
          {/* Left Column Description + Action Buttons */}
          <div className="lg:col-span-5 space-y-8 z-10">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-4xl font-display font-bold leading-tight text-white uppercase">
                Let’s Build Something Great Together
              </h3>
              <p className="text-[#BFC0C0] font-light leading-relaxed font-sans text-sm md:text-base">
                I’m always open to opportunities, collaborations, creative ideas, and meaningful conversations.
              </p>
            </div>

            {/* Pulsating Availability Indicator */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-500/5 border border-emerald-500/20 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-mono font-medium text-emerald-400 uppercase tracking-widest">
                Available for opportunities
              </span>
            </div>

            {/* Bullet list of Action links */}
            <div className="space-y-4 pt-4 border-t border-white/[0.04] font-mono">
              
              {/* Linked Phone Dial Action */}
              <a 
                href={`tel:${personalInfo.phone}`}
                data-cursor="call"
                className="flex items-center gap-4 group p-3 border border-white/[0.01] hover:border-accent-blue/15 hover:bg-white/[0.02] transition-all duration-300 rounded-none w-full"
              >
                <div className="p-2 sm:p-3 bg-white/[0.02] border border-white/[0.04] group-hover:border-accent-blue/30 text-white group-hover:text-accent-blue transition-colors duration-300">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left flex flex-col gap-0.5">
                  <span className="text-[9px] text-white/30 tracking-widest uppercase">DIRECT TELEPHONY</span>
                  <span className="text-sm text-white group-hover:text-accent-blue transition-colors font-medium tracking-wide">
                    +91 {personalInfo.phone}
                  </span>
                </div>
              </a>

              {/* Linked Email Mailto Action */}
              <a 
                href={`mailto:${personalInfo.email}`}
                data-cursor="email"
                className="flex items-center gap-4 group p-3 border border-white/[0.01] hover:border-accent-blue/15 hover:bg-white/[0.02] transition-all duration-300 rounded-none w-full"
              >
                <div className="p-2 sm:p-3 bg-white/[0.02] border border-white/[0.04] group-hover:border-accent-blue/30 text-white group-hover:text-accent-blue transition-colors duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left flex flex-col gap-0.5">
                  <span className="text-[9px] text-white/30 tracking-widest uppercase">OFFICIAL INBOX</span>
                  <span className="text-xs sm:text-sm text-white group-hover:text-accent-blue transition-colors font-medium tracking-normal break-all">
                    {personalInfo.email}
                  </span>
                </div>
              </a>

              {/* Location Action */}
              <div
                className="flex items-center gap-4 p-3 border border-white/[0.01] rounded-none w-full"
              >
                <div className="p-2 sm:p-3 bg-white/[0.02] border border-white/[0.04] text-white">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-left flex flex-col gap-0.5">
                  <span className="text-[9px] text-white/30 tracking-widest uppercase">HEADQUARTERS</span>
                  <span className="text-sm text-white font-medium tracking-normal">
                    {personalInfo.location}
                  </span>
                </div>
              </div>

            </div>

            {/* Direct Social Link Grid Iconography */}
            <div className="space-y-2 pt-4">
              <span className="text-[10px] font-mono tracking-[0.2em] text-white/30 uppercase block">DIRECT NETWORKS</span>
              <div className="flex items-center gap-3">
                
                {/* LinkedIn link with custom aesthetic hover */}
                {socialLinks.linkedin && (
                  <a
                    href={socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="linkedin"
                    className="p-3 bg-white/[0.02] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/60 hover:text-accent-blue rounded-none transition-all duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {/* Instagram link with custom aesthetic hover */}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="instagram"
                    className="p-3 bg-white/[0.02] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/60 hover:text-accent-blue rounded-none transition-all duration-300"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}

                {/* GitHub link with custom aesthetic hover */}
                {socialLinks.github && (
                  <a
                    href={socialLinks.github}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="github"
                    className="p-3 bg-white/[0.02] hover:bg-accent-blue/5 border border-white/[0.04] hover:border-accent-blue/30 text-white/60 hover:text-accent-blue rounded-none transition-all duration-300"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

              </div>
            </div>

          </div>

          {/* Right Column: Premium Form */}
          <div className="lg:col-span-7 z-10 w-full">
            <div className="glass-panel-neon p-6 md:p-10 rounded-none relative">
              
              {/* Corner accent bracket markings to complement design philosophy */}
              <div className="absolute top-0 right-0 w-4 h-[1.5px] bg-accent-blue/40" />
              <div className="absolute top-0 right-0 w-[1.5px] h-4 bg-accent-blue/40" />

              <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
                
                {/* Inputs Row 1: Name and Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Name field */}
                  <div className="relative group/field">
                    <label 
                      className={`absolute left-4 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest ${
                        focusedField === "name" || formData.name
                          ? "top-1 text-accent-blue scale-90"
                          : "top-[18px] text-white/40"
                      }`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      aria-label="Full Name"
                      value={formData.name}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className={`w-full pt-6 pb-2.5 px-4 bg-luxury-gray/40 border text-white font-sans text-sm focus:outline-none transition-all duration-300 rounded-none ${
                        formErrors.name 
                          ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]" 
                          : "border-white/[0.05] focus:border-accent-blue/80 focus:shadow-[0_0_12px_rgba(77,168,255,0.12)]"
                      }`}
                    />
                    {formErrors.name && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-500 font-mono mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.name}
                      </span>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="relative group/field">
                    <label 
                      className={`absolute left-4 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest ${
                        focusedField === "email" || formData.email
                          ? "top-1 text-accent-blue scale-90"
                          : "top-[18px] text-white/40"
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      aria-label="Email Address"
                      value={formData.email}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      onChange={handleInputChange}
                      disabled={isSending}
                      className={`w-full pt-6 pb-2.5 px-4 bg-luxury-gray/40 border text-white font-sans text-sm focus:outline-none transition-all duration-300 rounded-none ${
                        formErrors.email 
                          ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]" 
                          : "border-white/[0.05] focus:border-accent-blue/80 focus:shadow-[0_0_12px_rgba(77,168,255,0.12)]"
                      }`}
                    />
                    {formErrors.email && (
                      <span className="flex items-center gap-1 text-[11px] text-rose-500 font-mono mt-1">
                        <AlertCircle className="w-3 h-3" />
                        {formErrors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject field */}
                <div className="relative group/field">
                  <label 
                    className={`absolute left-4 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest ${
                      focusedField === "subject" || formData.subject
                        ? "top-1 text-accent-blue scale-90"
                        : "top-[18px] text-white/40"
                    }`}
                  >
                    Subject Topic 
                  </label>
                  <input
                    type="text"
                    name="subject"
                    aria-label="Subject Topic"
                    value={formData.subject}
                    onFocus={() => setFocusedField("subject")}
                    onBlur={() => setFocusedField(null)}
                    onChange={handleInputChange}
                    disabled={isSending}
                    className={`w-full pt-6 pb-2.5 px-4 bg-luxury-gray/40 border text-white font-sans text-sm focus:outline-none transition-all duration-300 rounded-none ${
                      formErrors.subject 
                        ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]" 
                        : "border-white/[0.05] focus:border-accent-blue/80 focus:shadow-[0_0_12px_rgba(77,168,255,0.12)]"
                    }`}
                  />
                  {formErrors.subject && (
                    <span className="flex items-center gap-1 text-[11px] text-rose-500 font-mono mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.subject}
                    </span>
                  )}
                </div>

                {/* Message field */}
                <div className="relative group/field">
                  <label 
                    className={`absolute left-4 transition-all duration-300 font-mono text-[10px] uppercase tracking-widest ${
                      focusedField === "message" || formData.message
                        ? "top-1 text-accent-blue scale-90"
                        : "top-[18px] text-white/40"
                    }`}
                  >
                    Transcribe Message
                  </label>
                  <textarea
                    name="message"
                    aria-label="Transcribe Message"
                    rows={5}
                    value={formData.message}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    onChange={handleInputChange}
                    disabled={isSending}
                    className={`w-full pt-6 pb-2.5 px-4 bg-luxury-gray/40 border text-white font-sans text-sm focus:outline-none transition-all duration-300 rounded-none resize-none ${
                      formErrors.message 
                        ? "border-rose-500/60 focus:border-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.1)]" 
                        : "border-white/[0.05] focus:border-accent-blue/80 focus:shadow-[0_0_12px_rgba(77,168,255,0.12)]"
                    }`}
                  />
                  {formErrors.message && (
                    <span className="flex items-center gap-1 text-[11px] text-rose-500 font-mono mt-1">
                      <AlertCircle className="w-3 h-3" />
                      {formErrors.message}
                    </span>
                  )}
                </div>

                {/* Status messages triggers */}
                <AnimatePresence mode="wait">
                  {statusMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`flex items-start gap-2.5 p-4 border font-mono text-xs text-left ${
                        statusType === "success"
                          ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
                          : "bg-rose-500/5 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {statusType === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>{statusMessage}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSending}
                  data-cursor="send"
                  id="contact-submit-btn"
                  className={`cursor-none w-full py-4 bg-[#F5F5F5] hover:bg-transparent text-black hover:text-white border border-white hover:border-accent-blue font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
                    isSending ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Transmitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>

              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
