import { motion, AnimatePresence } from "framer-motion";
import { Send, ChevronDown, ArrowRight, Phone } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import Base from "./Components/Tailwind/Base";
import CreateReactScript from "./Utils/CreateReactScript";
import Header from "./components/Tailwind/Header";
import Footer from "./components/Tailwind/Footer";
import { CarritoContext, CarritoProvider } from "./context/CarritoContext";
import TextWithHighlight from "./Utils/TextWithHighlight";
import ContactForm from "./Components/Contact/ContactForm";
import MaintenancePage from "./Utils/MaintenancePage";
import { useTranslation } from "./hooks/useTranslation";
import MessagesRest from "./Actions/MessagesRest";
import Swal from "sweetalert2";
import GeneralRest from "./actions/GeneralRest";

// Animaciones mejoradas
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
            duration: 0.6,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 80,
            damping: 15,
            duration: 0.7,
        },
    },
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

const slideInLeft = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const slideInRight = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
};

const buttonHover = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
        scale: 1.02,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
        transition: { duration: 0.3, ease: "easeOut" },
    },
    tap: {
        scale: 0.98,
        transition: { duration: 0.1 },
    },
};

const inputFocus = {
    rest: { 
        borderColor: "#cbd5e1",
        boxShadow: "none",
        scale: 1,
    },
    focus: {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
        scale: 1.01,
        transition: { duration: 0.2 },
    },
};

const cardHover = {
    rest: { 
        y: 0, 
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        scale: 1,
    },
    hover: {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
    },
};

const ContactoPage = ({ landing, sedes, whatsapp, staff }) => {
  const landingFormulario = landing?.find(
        (item) => item.correlative === "page_contact_formulario"
    );
 
   /*     const landingForm = landing?.find(
        (item) => item.correlative === "page_contact_form"
    );
     const landingSoporte = landing?.find(
        (item) => item.correlative === "page_contact_help"
    );
    const sectionone = landing?.find(
        (item) => item.correlative === "page_contact_sectionone"
    );
    const sectiontwo = landing?.find(
        (item) => item.correlative === "page_contact_sectiontwo"
    );
    const landingVentas = landing?.find(
        (item) => item.correlative === "page_contact_ventas"
    );
    const sectiontree = landing?.find(
        (item) => item.correlative === "page_contact_sectiontree"
    );
    const sectionfour = landing?.find(
        (item) => item.correlative === "page_contact_sectionfour"
    );
    const sectionfive = landing?.find(
        (item) => item.correlative === "page_contact_sectionfive"
    ); */
const messagesRest = new MessagesRest();

// Opción 1: Deshabilitar notificaciones automáticas para usar notificaciones personalizadas
messagesRest.enableNotifications = false;

// Opción 2: Usando method chaining (alternativa más elegante)
// const messagesRest = new MessagesRest().withoutNotifications();

// Opción 3: Usando el método setNotifications
// const messagesRest = new MessagesRest().setNotifications(false);


const nameRef = useRef()
  const phoneRef = useRef()
  const emailRef = useRef()
  const descriptionRef = useRef()
    const lastnameRef = useRef()

  const [sending, setSending] = useState(false)

  // Función para limpiar el formulario
  const clearForm = () => {
    const fields = [nameRef, lastnameRef, phoneRef, emailRef, descriptionRef];
    
    fields.forEach((ref, index) => {
      if (ref.current) {
        // Pequeño delay para crear efecto de limpieza secuencial
        setTimeout(() => {
          ref.current.value = "";
          // Opcional: agregar una pequeña animación visual
          ref.current.style.transform = 'scale(0.98)';
          setTimeout(() => {
            ref.current.style.transform = 'scale(1)';
          }, 100);
        }, index * 50);
      }
    });
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    setSending(true)

    const request = {
      name: nameRef.current.value + ' ' + lastnameRef.current.value,
      subject: phoneRef.current.value,
      email: emailRef.current.value,
      description: descriptionRef.current.value,
     
    }

    const result = await messagesRest.save(request);
    setSending(false)

    if (!result) {
      // Mostrar error personalizado ya que las notificaciones automáticas están deshabilitadas
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Entendido'
      })
      return
    }

    // Mostrar éxito personalizado
    Swal.fire({
      icon: 'success',
      title: 'Mensaje enviado',
      text: 'Tu mensaje ha sido enviado correctamente. ¡Nos pondremos en contacto contigo pronto!',
      showConfirmButton: false,
      timer: 3000
    })

    // Verificar si hay redirección (usar result en lugar de data)
    if (result.redirect) {
      location.href = result.redirect
    }

    // Limpiar los campos del formulario
    clearForm()
  }




const generalRest = new GeneralRest();
const [aboutuses, setAboutuses] = useState([]);

     useEffect(() => {
           const fetchAboutuses = async () => {
               try {
                   const data = await generalRest.getAboutuses();
                   setAboutuses(data);
               } catch (error) {
                   console.error("Error fetching about:", error);
               }
           };
   
           fetchAboutuses();
       }, []);
   
 
       const generalsData = aboutuses?.generals || [];

  //location = -12.08572604235328,-76.99121088594794

  const location = generalsData.find(item => item.correlative === "location")?.value || "-12.08572604235328,-76.99121088594794";
  const mapSrc = `https://www.google.com/maps/embed/v1/place?key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&q=${location}`;
  const mapSrcWithZoom = `${mapSrc}&zoom=12`;
  const mapSrcWithOutput = `${mapSrc}&output=embed`;
  const mapSrcWithEmbed = `${mapSrc}&embed=true`;
  const mapSrcWithLocation = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndEmbed = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed`;
  const mapSrcWithLocationAndEmbedAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKey = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutput = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutputAndEmbed = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed&embed=true`;
  const mapSrcWithLocationAndEmbedAndOutputAndZoomAndKeyAndOutputAndEmbedAndZoom = `https://www.google.com/maps?q=${location}&z=12&output=embed&embed=true&key=AIzaSyD8b2d3f4e5f6g7h8i9j0k1l2m3n4o5p&output=embed&embed=true&zoom=12`;
 
    return (
        <motion.div 
            className="font-paragraph text-neutral-dark min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <Header />
            <motion.main 
                className="flex flex-col items-center justify-center min-h-[80vh] py-16"
                variants={itemVariants}
            >
                <motion.div 
                    className="w-full px-[5%] mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 bg-transparent"
                    variants={containerVariants}
                >
                    {/* Left: Contact Form */}
                    <motion.div 
                        className="bg-neutral-light rounded-2xl p-8 flex flex-col justify-between shadow-md min-h-[500px]"
                        variants={slideInLeft}
                        whileHover={{ y: -5, transition: { duration: 0.3 } }}
                    >
                        <div>
                           
                         <motion.div 
                            className="flex items-center mb-4"
                            variants={itemVariants}
                         >
                            <motion.div 
                                className="mr-2"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span>
                                    <svg width="15" height="24" viewBox="0 0 15 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7.50225 0C5.95566 0 4.69727 1.2584 4.69727 2.80499C4.69727 4.35158 5.95566 5.60998 7.50225 5.60998C9.04885 5.60998 10.3072 4.35158 10.3072 2.80499C10.3072 1.2584 9.04885 0 7.50225 0Z" fill="#D62828" />
                                        <path d="M7.50112 24.0025C3.65842 24.0025 0.759766 22.4639 0.759766 20.4219C0.759766 19.9629 1.13269 19.59 1.59168 19.59C2.05066 19.59 2.42359 19.9629 2.42359 20.4219C2.42359 21.203 4.40166 22.3387 7.49981 22.3387C10.5993 22.3387 12.576 21.2043 12.576 20.4219C12.576 19.8743 12.4874 19.3657 12.3048 18.8689C12.147 18.4373 12.3674 17.9601 12.799 17.801C13.2306 17.6432 13.7092 17.8636 13.8669 18.2952C14.1147 18.9693 14.2399 19.6839 14.2399 20.4206C14.2425 22.4639 11.3451 24.0025 7.50112 24.0025Z" fill="#D62828" />
                                        <path d="M11.4896 21.804C12.3046 21.4414 12.7754 20.9968 12.8132 20.6225C5.70098 16.9581 5.32021 11.2634 5.32021 10.1015C5.32021 9.64249 4.94725 9.26953 4.48823 9.26953C4.02921 9.26953 3.65625 9.64249 3.65625 10.1015C3.65625 11.4082 4.06181 17.6884 11.4896 21.804Z" fill="#D62828" />
                                        <path d="M7.49991 6.25781C5.37954 6.25781 3.6543 7.98306 3.6543 10.1034C3.6543 10.5624 4.02725 10.9354 4.48627 10.9354C4.9453 10.9354 5.31825 10.5624 5.31825 10.1034C5.31825 8.9011 6.29628 7.92177 7.49991 7.92177C8.70353 7.92177 9.68156 8.8998 9.68156 10.1034C9.68156 10.9432 8.14671 11.9108 6.66272 12.8458C6.33019 13.0558 5.98722 13.2709 5.64296 13.4965C5.81248 13.9855 6.03026 14.5059 6.31454 15.047C6.72531 14.7732 7.1426 14.5111 7.55077 14.2542C9.58768 12.971 11.3468 11.8626 11.3468 10.1034C11.3455 7.98306 9.62158 6.25781 7.49991 6.25781Z" fill="#D62828" />
                                        <path d="M4.23503 14.4766C2.36765 15.8954 0.759766 17.7158 0.759766 20.4191C0.759766 20.8781 1.13272 21.251 1.59174 21.251C2.05076 21.251 2.42372 20.8781 2.42372 20.4191C2.42372 18.5465 3.53085 17.1707 4.95486 16.0271C4.66406 15.4937 4.42673 14.9734 4.23503 14.4766Z" fill="#D62828" />
                                    </svg>

                                </span>
                            </motion.div>
                            <motion.h3 
                                className="uppercase text-neutral-dark text-sm lg:text-lg font-bold"
                                variants={itemVariants}
                            >
                                Contáctanos
                            </motion.h3>
                        </motion.div>

                        {/* Título principal */}
                        <motion.h2 
                            className="text-4xl lg:text-[52px] font-medium mb-6 leading-tight italic"
                            variants={itemVariants}
                        >
<TextWithHighlight text={landingFormulario?.title || "Contáctenos"} highlight="RR.HH" />


                            
                       
                        </motion.h2>
                          
                        <motion.p 
                            className="mt-4 text-lg text-neutral max-w-3xl mx-auto"
                            variants={itemVariants}
                        >
                            {landingFormulario?.description || ""}
                        </motion.p>
                        </div>


                        
                        {/* Contact Form */}
                        <motion.form 
                            onSubmit={onSubmit} 
                            className="w-full flex flex-col gap-4 mt-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div 
                                className="flex flex-col lg:flex-row gap-3"
                                variants={itemVariants}
                            >
                                <motion.input 
                                    ref={nameRef} 
                                    type="text" 
                                    placeholder="Nombre" 
                                    className="flex-1 border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                                <motion.input 
                                    ref={lastnameRef} 
                                    type="text" 
                                    placeholder="Apellido" 
                                    className="flex-1 border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                            </motion.div>
                            <motion.div 
                                className="flex flex-col lg:flex-row gap-3"
                                variants={itemVariants}
                            >
                                <motion.input 
                                    ref={phoneRef} 
                                    type="text" 
                                    placeholder="Teléfono" 
                                    className="flex-1 border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                                <motion.input 
                                    ref={emailRef} 
                                    type="email" 
                                    placeholder="Correo electrónico" 
                                    className="flex-1 border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                    variants={inputFocus}
                                    initial="rest"
                                    whileFocus="focus"
                                    whileHover={{ scale: 1.01 }}
                                    style={{ transition: 'transform 0.2s ease-in-out' }}
                                />
                            </motion.div>
                            <motion.textarea 
                                ref={descriptionRef} 
                                placeholder="Escribir mensaje" 
                                rows={4} 
                                className="border border-[#cbd5e1] rounded-md px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-200"
                                variants={itemVariants}
                                whileFocus={{ scale: 1.01 }}
                                whileHover={{ scale: 1.01 }}
                                style={{ transition: 'transform 0.2s ease-in-out' }}
                            />
                            <motion.button 
                                type="submit" 
                                className="mt-2 bg-accent max-w-max text-white font-semibold rounded-md px-6 py-3 flex items-center justify-center gap-2 transition-all duration-300"
                                variants={buttonHover}
                                initial="rest"
                                whileHover="hover"
                                whileTap="tap"
                                disabled={sending}
                            >
                                <AnimatePresence mode="wait">
                                    {sending ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <motion.div
                                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                            />
                                            Enviando...
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="send"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            Enviar mensaje
                                            <motion.div
                                                whileHover={{ x: 5 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <ArrowRight size={18} />
                                            </motion.div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.form>
                    </motion.div>
                    {/* Right: Map and Info Cards */}
                    <motion.div 
                        className="flex flex-col gap-6"
                        variants={slideInRight}
                    >
                        {/* Map */}
                        <motion.div 
                            className="rounded-2xl overflow-hidden shadow-md w-full h-72 md:h-full min-h-[300px]"
                            variants={fadeInScale}
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        >
                            <iframe
                                title="Ubicación Lima"
                                src={mapSrcWithLocationAndEmbedAndOutput}
                                width="100%"
                                height="100%"
                                className="w-full h-full border-0"
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </motion.div>
                        
                        {/* Info Cards */}
                        <motion.div 
                            className="flex flex-col gap-3"
                            variants={containerVariants}
                        >
                            <motion.div 
                                className="grid grid-cols-1 md:grid-cols-2 gap-3"
                                variants={itemVariants}
                            >
                                {/* Email */}
                                <motion.div 
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.span 
                                        className="bg-[#e53935] text-white rounded-full p-2"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-.659 1.591l-7.5 7.5a2.25 2.25 0 01-3.182 0l-7.5-7.5A2.25 2.25 0 012.25 6.993V6.75" />
                                        </svg>
                                    </motion.span>
                                    <div>
                                        <motion.div 
                                            className="font-semibold text-[#111827]"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Correo electrónico
                                        </motion.div>
                                        <motion.div 
                                            className="text-[#374151] text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                           {generalsData.find(item => item.correlative === "email_contact")?.description || ""}
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                {/* Phone */}
                                <motion.div 
                                    className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                    variants={cardHover}
                                    initial="rest"
                                    whileHover="hover"
                                >
                                    <motion.span 
                                        className="bg-[#e53935] text-white rounded-full p-2"
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.5 }}
                                    >
                                      <Phone/>
                                    </motion.span>
                                    <div>
                                        <motion.div 
                                            className="font-semibold text-[#111827]"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                        >
                                            Contacto
                                        </motion.div>
                                        <motion.div 
                                            className="text-[#374151] text-sm"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            {generalsData.find(item => item.correlative === "phone_contact")?.description || ""}
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>
                            
                            {/* Location */}
                            <motion.div 
                                className="flex items-center gap-3 bg-white rounded-xl p-4 shadow border border-[#f3f4f6]"
                                variants={cardHover}
                                initial="rest"
                                whileHover="hover"
                            >
                                <motion.span 
                                    className="bg-[#e53935] text-white rounded-full p-2"
                                    whileHover={{ rotate: 360, scale: 1.1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                                    </svg>
                                </motion.span>
                                <div>
                                    <motion.div 
                                        className="font-semibold text-[#111827]"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        Ubicación
                                    </motion.div>
                                    <motion.div 
                                        className="text-[#374151] text-sm"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        {generalsData.find(item => item.correlative === "address")?.description || "Lima, Perú"}
                                    </motion.div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.main>
            <Footer />
        </motion.div>
    );
};

CreateReactScript((el, properties) => {
    createRoot(el).render(
        <CarritoProvider>
            <Base {...properties}>
                <ContactoPage {...properties} />
            </Base>
        </CarritoProvider>
    );
});
