import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const budgetRanges = [
    "< $500",
    "$500 - $1,000",
    "$1,000 - $3,000",
    "$3,000 - $5,000",
    "$5,000+",
    "Por definir"
  ];

  // Validaciones
  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'El nombre es requerido';
        if (value.length < 2) return 'Mínimo 2 caracteres';
        return '';
      
      case 'email':
        if (!value.trim()) return 'El email es requerido';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Email inválido';
        return '';
      
      case 'subject':
        if (!value.trim()) return 'El asunto es requerido';
        if (value.length < 5) return 'Mínimo 5 caracteres';
        return '';
      
      case 'message':
        if (!value.trim()) return 'El mensaje es requerido';
        if (value.length < 20) return 'Mínimo 20 caracteres';
        return '';
      
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'budget') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        subject: true,
        message: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Configuración de EmailJS
      const SERVICE_ID = 'service_ch4b0eo';
      const TEMPLATE_ID = 'template_mtunisd';
      const PUBLIC_KEY = 't7KUufrYJUz0mb0cx';

      const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            budget: formData.budget || 'No especificado',
          }
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          budget: '',
        });
        setTouched({});
        setErrors({});
        
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        throw new Error('Error al enviar');
      }
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClasses = (fieldName) => {
    const baseClasses = "w-full px-4 py-3 bg-zinc-800/50 border rounded-xl text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2";
    
    if (errors[fieldName] && touched[fieldName]) {
      return `${baseClasses} border-red-500/50 focus:border-red-500 focus:ring-red-500/20`;
    }
    
    if (touched[fieldName] && !errors[fieldName] && formData[fieldName]) {
      return `${baseClasses} border-[#00ff88]/50 focus:border-[#00ff88] focus:ring-[#00ff88]/20`;
    }
    
    return `${baseClasses} border-zinc-700/50 focus:border-[#00ff88] focus:ring-[#00ff88]/20`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nombre y Email en grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">
            Nombre Completo *
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Tu nombre"
              className={getInputClasses('name')}
            />
            {touched.name && !errors.name && formData.name && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {errors.name && touched.name && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">
            Email *
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="tu@email.com"
              className={getInputClasses('email')}
            />
            {touched.email && !errors.email && formData.email && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="w-5 h-5 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>
          {errors.email && touched.email && (
            <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Asunto */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-zinc-300 mb-2">
          Asunto *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="¿En qué puedo ayudarte?"
          className={getInputClasses('subject')}
        />
        {errors.subject && touched.subject && (
          <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.subject}
          </p>
        )}
      </div>

      {/* Presupuesto */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-zinc-300 mb-2">
          Presupuesto Estimado (Opcional)
        </label>
        <select
          id="budget"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-zinc-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:border-[#00ff88] focus:ring-[#00ff88]/20 cursor-pointer"
        >
          <option value="">Selecciona un rango</option>
          {budgetRanges.map((range, index) => (
            <option key={index} value={range}>{range}</option>
          ))}
        </select>
      </div>

      {/* Mensaje */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">
          Mensaje *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Cuéntame sobre tu proyecto, objetivos y cualquier detalle relevante..."
          rows="6"
          className={getInputClasses('message') + " resize-none"}
        />
        <div className="flex items-center justify-between mt-2">
          {errors.message && touched.message ? (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.message}
            </p>
          ) : (
            <p className="text-xs text-zinc-500">
              {formData.message.length} / 500 caracteres
            </p>
          )}
        </div>
      </div>

      {/* Botón Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-gradient-to-r from-[#00ff88] to-[#00cc6f] text-zinc-900 font-bold rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,136,0.4)] hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group relative overflow-hidden"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isSubmitting ? (
            <>
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              Enviar Mensaje
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </span>
        
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </button>

      {/* Mensajes de estado */}
      {submitStatus === 'success' && (
        <div className="p-4 bg-[#00ff88]/10 border border-[#00ff88]/20 rounded-xl flex items-start gap-3 animate-fade-up">
          <div className="w-6 h-6 rounded-full bg-[#00ff88]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-[#00ff88]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-[#00ff88] mb-1">¡Mensaje enviado exitosamente!</p>
            <p className="text-xs text-zinc-400">Te responderé lo antes posible. Revisa tu email.</p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-fade-up">
          <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-red-400 mb-1">Error al enviar el mensaje</p>
            <p className="text-xs text-zinc-400">Por favor, intenta nuevamente o contáctame directamente por email.</p>
          </div>
        </div>
      )}

      {/* Nota de privacidad */}
      <p className="text-xs text-zinc-500 text-center">
        Al enviar este formulario, aceptas que tus datos sean utilizados para contactarte sobre tu solicitud.
      </p>
    </form>
  );
}