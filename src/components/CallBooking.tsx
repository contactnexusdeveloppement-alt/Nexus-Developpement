import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Phone, Clock, CalendarDays, User, Mail, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { format, addDays, isWeekend, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

// Available time slots (9h-18h with 30min intervals)
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

const DURATIONS = [
  { value: 15, label: '15 min', description: 'Appel découverte rapide' },
  { value: 30, label: '30 min', description: 'Discussion de projet' },
  { value: 60, label: '1 heure', description: 'Consultation approfondie' },
];

export function CallBooking() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<number>(30);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Fetch booked slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookedSlots = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data } = await supabase
      .rpc('get_booked_slots', { p_booking_date: dateStr });

    if (data) {
      const blocked: string[] = [];
      data.forEach((booking: { time_slot: string; duration: number }) => {
        const startIndex = TIME_SLOTS.indexOf(booking.time_slot);
        const slotsNeeded = Math.ceil(booking.duration / 30);
        for (let i = 0; i < slotsNeeded && startIndex + i < TIME_SLOTS.length; i++) {
          blocked.push(TIME_SLOTS[startIndex + i]);
        }
      });
      setBookedSlots(blocked);
    }
  };

  const isSlotAvailable = (time: string) => {
    if (bookedSlots.includes(time)) return false;

    if (selectedDate) {
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      if (isToday) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= now) {
          return false;
        }
      }
    }

    const startIndex = TIME_SLOTS.indexOf(time);
    const slotsNeeded = Math.ceil(selectedDuration / 30);

    for (let i = 0; i < slotsNeeded; i++) {
      if (startIndex + i >= TIME_SLOTS.length || bookedSlots.includes(TIME_SLOTS[startIndex + i])) {
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime || !name || !email || !phone) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('send-call-booking', {
        body: {
          name,
          email,
          phone,
          booking_date: format(selectedDate, 'yyyy-MM-dd'),
          time_slot: selectedTime,
          duration: selectedDuration,
        },
      });

      if (error) throw error;

      toast({
        title: "Réservation confirmée ! 📞",
        description: `Votre appel est prévu le ${format(selectedDate, 'EEEE d MMMM', { locale: fr })} à ${selectedTime}`,
      });

      const startIndex = TIME_SLOTS.indexOf(selectedTime);
      const slotsNeeded = Math.ceil(selectedDuration / 30);
      const newBlockedSlots: string[] = [];
      for (let i = 0; i < slotsNeeded && startIndex + i < TIME_SLOTS.length; i++) {
        newBlockedSlots.push(TIME_SLOTS[startIndex + i]);
      }
      setBookedSlots(prev => [...prev, ...newBlockedSlots]);

      setSelectedDate(undefined);
      setSelectedTime('');
      setName('');
      setEmail('');
      setPhone('');
      setStep(1);
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabledDays = (date: Date) => {
    return isWeekend(date) || isBefore(date, startOfDay(new Date()));
  };

  const stepVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  return (
    <section id="reservation" className="py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-xl md:blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-600/20 rounded-full blur-xl md:blur-3xl -z-10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-4 pb-3 leading-relaxed"
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.6)]">
              Réservez un appel
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-blue-100/80 max-w-2xl mx-auto text-lg"
          >
            Choisissez un créneau qui vous convient et discutons de votre projet
          </motion.p>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-900/40 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8 shadow-[0_0_50px_rgba(8,145,178,0.15)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Step indicators */}
            <div className="flex justify-center mb-10 relative z-10" role="navigation" aria-label="Étapes du formulaire">
              <div className="flex items-center gap-4">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <motion.div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step >= s
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]'
                        : 'bg-slate-800/80 text-slate-400 border border-white/5'
                        }`}
                      animate={{
                        scale: step === s ? 1.1 : 1,
                        opacity: step >= s ? 1 : 0.7
                      }}
                    >
                      {step > s ? <Check className="w-5 h-5" /> : s}
                    </motion.div>
                    {s < 3 && (
                      <div className={`w-12 md:w-20 h-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-800'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="relative z-10 min-h-[400px]">
              <AnimatePresence mode="wait" custom={direction}>

                {/* Step 1: Duration */}
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2">
                      <h3 className="text-2xl font-semibold text-white">Quelle durée prévoir ?</h3>
                      <p className="text-blue-200/60">Sélectionnez le temps nécessaire pour notre échange</p>
                    </div>

                    <RadioGroup
                      value={selectedDuration.toString()}
                      onValueChange={(v) => setSelectedDuration(parseInt(v))}
                      className="grid gap-4 md:grid-cols-3"
                    >
                      {DURATIONS.map((duration) => (
                        <Label
                          key={duration.value}
                          htmlFor={`duration-${duration.value}`}
                          className={`group relative flex flex-col items-center p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${selectedDuration === duration.value
                            ? 'bg-blue-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(34,211,238,0.2)] scale-105'
                            : 'bg-slate-800/20 border-white/5 hover:bg-slate-800/40 hover:border-white/10 hover:scale-[1.02]'
                            }`}
                        >
                          <RadioGroupItem
                            value={duration.value.toString()}
                            id={`duration-${duration.value}`}
                            className="sr-only"
                          />
                          <div className={`p-3 rounded-full mb-4 ${selectedDuration === duration.value ? 'bg-cyan-400/20 text-cyan-400' : 'bg-slate-700/30 text-slate-400'}`}>
                            <Clock className="w-6 h-6" />
                          </div>
                          <span className="text-xl font-bold text-white mb-2">{duration.label}</span>
                          <span className="text-sm text-blue-200/60 text-center">{duration.description}</span>
                          {selectedDuration === duration.value && (
                            <motion.div className="absolute inset-0 border-2 border-cyan-400/50 rounded-2xl" layoutId="duration-ring" />
                          )}
                        </Label>
                      ))}
                    </RadioGroup>

                    <div className="flex justify-center pt-4">
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 py-6 text-lg font-semibold hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all flex items-center gap-2 group"
                      >
                        Continuer <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-6"
                  >
                    <div className="text-center space-y-2 mb-6">
                      <h3 className="text-2xl font-semibold text-white">Vos disponibilités</h3>
                      <p className="text-blue-200/60">Sélectionnez une date et une heure de rendez-vous</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                      {/* Calendar */}
                      <div className="flex justify-center bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTime('');
                          }}
                          disabled={disabledDays}
                          locale={fr}
                          fromDate={new Date()}
                          toDate={addDays(new Date(), 60)}
                          className="pointer-events-auto"
                          classNames={{
                            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                            month: "space-y-4",
                            caption: "flex justify-center pt-1 relative items-center text-cyan-200 font-semibold text-lg",
                            caption_label: "text-base font-semibold text-cyan-100",
                            nav: "space-x-1 flex items-center",
                            nav_button: "h-8 w-8 bg-blue-800/30 hover:bg-blue-700 text-cyan-200 hover:text-white rounded-lg border border-blue-500/20 transition-colors",
                            nav_button_previous: "absolute left-1",
                            nav_button_next: "absolute right-1",
                            table: "w-full border-collapse space-y-1",
                            head_row: "flex",
                            head_cell: "text-blue-300/60 rounded-md w-9 font-medium text-[0.8rem]",
                            row: "flex w-full mt-2 gap-1",
                            cell: "h-9 w-9 text-center text-sm p-0 relative",
                            day: "h-9 w-9 p-0 font-medium rounded-lg transition-all text-blue-100 hover:bg-white/10 hover:text-white",
                            day_selected: "bg-gradient-to-tr from-blue-500 to-cyan-500 text-white shadow-lg",
                            day_today: "ring-1 ring-cyan-400 text-cyan-200 bg-cyan-400/10",
                            day_outside: "text-slate-700 opacity-50",
                            day_disabled: "text-slate-700 opacity-30 hover:bg-transparent cursor-not-allowed",
                            day_hidden: "invisible",
                          }}
                        />
                      </div>

                      {/* Time slots */}
                      <div className="space-y-4">
                        <p className="text-sm font-medium text-blue-200/80 flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-cyan-400" />
                          {selectedDate
                            ? `Créneaux du ${format(selectedDate, 'd MMMM', { locale: fr })}`
                            : 'Veuillez choisir une date'
                          }
                        </p>

                        {selectedDate ? (
                          <div className="grid grid-cols-3 gap-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                            {TIME_SLOTS.map((time) => {
                              const available = isSlotAvailable(time);
                              return (
                                <motion.button
                                  whileHover={{ scale: available ? 1.05 : 1 }}
                                  whileTap={{ scale: available ? 0.95 : 1 }}
                                  key={time}
                                  type="button"
                                  disabled={!available}
                                  onClick={() => setSelectedTime(time)}
                                  className={`py-3 px-2 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${selectedTime === time
                                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                                    : available
                                      ? 'bg-slate-800/50 text-blue-100 hover:bg-slate-700 border border-white/5'
                                      : 'bg-slate-900/30 text-slate-700 cursor-not-allowed'
                                    }`}
                                >
                                  {time}
                                  {selectedTime === time && (
                                    <motion.div
                                      className="absolute inset-0 bg-white/20"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      transition={{ duration: 0.2 }}
                                    />
                                  )}
                                </motion.button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-[300px] flex flex-col items-center justify-center text-blue-200/40 border-2 border-dashed border-white/5 rounded-2xl bg-slate-900/20">
                            <CalendarDays className="w-12 h-12 mb-2 opacity-50" />
                            <p>Sélectionnez une date</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="ghost"
                        className="text-blue-200 hover:text-white hover:bg-white/5"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Retour
                      </Button>
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!selectedDate || !selectedTime}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Suivant <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Contact info */}
                {step === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={stepVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="space-y-8"
                  >
                    <div className="text-center space-y-2 mb-6">
                      <h3 className="text-2xl font-semibold text-white">Vos coordonnées</h3>
                      <p className="text-blue-200/60">Dernière étape pour valider votre réservation</p>
                    </div>

                    {/* Summary Card */}
                    <div className="bg-gradient-to-r from-blue-900/40 to-cyan-900/40 rounded-2xl p-6 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                          <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-200/60">Date et heure</p>
                          <p className="text-white font-medium text-lg">
                            {selectedDate && format(selectedDate, 'd MMMM', { locale: fr })} à {selectedTime}
                          </p>
                        </div>
                      </div>
                      <div className="h-10 w-px bg-white/10 hidden md:block" />
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                          <Clock className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm text-blue-200/60">Durée</p>
                          <p className="text-white font-medium text-lg">{selectedDuration} minutes</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-blue-200">Nom complet</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-5 h-5 text-blue-400/50" />
                          <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Votre nom"
                            required
                            className="pl-10 bg-slate-900/50 border-white/10 text-white focus:border-cyan-400/50 focus:ring-cyan-400/20 h-12 rounded-xl transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-blue-200">Email professionnel</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-blue-400/50" />
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="vous@entreprise.com"
                              required
                              className="pl-10 bg-slate-900/50 border-white/10 text-white focus:border-cyan-400/50 focus:ring-cyan-400/20 h-12 rounded-xl transition-all"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-blue-200">Téléphone</Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 w-5 h-5 text-blue-400/50" />
                            <Input
                              id="phone"
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              placeholder="06 12 34 56 78"
                              required
                              className="pl-10 bg-slate-900/50 border-white/10 text-white focus:border-cyan-400/50 focus:ring-cyan-400/20 h-12 rounded-xl transition-all"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-6">
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="ghost"
                        className="text-blue-200 hover:text-white hover:bg-white/5"
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Retour
                      </Button>
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full px-8 py-6 text-lg font-semibold hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all shadow-lg shadow-blue-500/20 min-w-[200px]"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Validation...
                          </div>
                        ) : 'Confirmer le rendez-vous'}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
