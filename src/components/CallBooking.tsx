import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Phone, Clock, CalendarDays, User, Mail } from 'lucide-react';
import { format, addDays, isWeekend, isBefore, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

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

  // Fetch booked slots for selected date
  useEffect(() => {
    if (selectedDate) {
      fetchBookedSlots(selectedDate);
    }
  }, [selectedDate]);

  const fetchBookedSlots = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    // Use secure RPC function that only returns time_slot and duration (no personal data)
    const { data } = await supabase
      .rpc('get_booked_slots', { p_booking_date: dateStr });
    
    if (data) {
      // Calculate all blocked slots based on booked appointments
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
    
    // Filter out past time slots for today
    if (selectedDate) {
      const now = new Date();
      const isToday = selectedDate.toDateString() === now.toDateString();
      if (isToday) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        if (slotTime <= now) {
          return false; // Slot is in the past
        }
      }
    }
    
    // Check if there's enough consecutive slots for the selected duration
    const startIndex = TIME_SLOTS.indexOf(time);
    const slotsNeeded = Math.ceil(selectedDuration / 30);
    
    for (let i = 0; i < slotsNeeded; i++) {
      if (startIndex + i >= TIME_SLOTS.length || bookedSlots.includes(TIME_SLOTS[startIndex + i])) {
        return false;
      }
    }
    return true;
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

      // Optimistically add the booked slot(s) to prevent double-booking immediately
      const startIndex = TIME_SLOTS.indexOf(selectedTime);
      const slotsNeeded = Math.ceil(selectedDuration / 30);
      const newBlockedSlots: string[] = [];
      for (let i = 0; i < slotsNeeded && startIndex + i < TIME_SLOTS.length; i++) {
        newBlockedSlots.push(TIME_SLOTS[startIndex + i]);
      }
      setBookedSlots(prev => [...prev, ...newBlockedSlots]);

      // Reset form
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

  return (
    <section id="reservation" className="py-20 relative">
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 pb-3 leading-relaxed">
            <span className="bg-gradient-to-r from-blue-400 via-blue-200 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              Réservez un appel
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choisissez un créneau qui vous convient et discutons de votre projet
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-blue-950/80 to-blue-900/60 rounded-2xl border border-blue-500/30 p-6 md:p-8 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
            
            {/* Step indicators */}
            <div className="flex justify-center mb-8" role="navigation" aria-label="Étapes du formulaire">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        step >= s 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-blue-900/50 text-blue-400 border border-blue-500/30'
                      }`}
                      aria-current={step === s ? "step" : undefined}
                      aria-label={`Étape ${s}${step === s ? ' (actuelle)' : step > s ? ' (complétée)' : ''}`}
                    >
                      {s}
                    </div>
                    {s < 3 && (
                      <div className={`w-12 h-0.5 mx-1 ${step > s ? 'bg-blue-500' : 'bg-blue-500/30'}`} aria-hidden="true" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Step 1: Duration */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Choisissez la durée de l'appel
                  </h3>
                  
                  <RadioGroup
                    value={selectedDuration.toString()}
                    onValueChange={(v) => setSelectedDuration(parseInt(v))}
                    className="grid gap-4 md:grid-cols-3"
                  >
                    {DURATIONS.map((duration) => (
                      <Label
                        key={duration.value}
                        htmlFor={`duration-${duration.value}`}
                        className={`flex flex-col items-center p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedDuration === duration.value
                            ? 'bg-blue-500/20 border-blue-400'
                            : 'bg-blue-900/30 border-blue-500/20 hover:border-blue-500/40'
                        }`}
                      >
                        <RadioGroupItem
                          value={duration.value.toString()}
                          id={`duration-${duration.value}`}
                          className="sr-only"
                        />
                        <span className="text-2xl font-bold text-white">{duration.label}</span>
                        <span className="text-sm text-blue-200/70 mt-1">{duration.description}</span>
                      </Label>
                    ))}
                  </RadioGroup>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-cyan-400" />
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                      Choisissez la date et l'heure
                    </span>
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Calendar */}
                    <div className="flex justify-center">
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
                        className="rounded-xl border border-blue-400/50 bg-blue-900/70 p-3 pointer-events-auto"
                        classNames={{
                          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                          month: "space-y-4",
                          caption: "flex justify-center pt-1 relative items-center text-cyan-200 font-semibold",
                          caption_label: "text-base font-semibold text-cyan-100",
                          nav: "space-x-1 flex items-center",
                          nav_button: "h-7 w-7 bg-blue-800/80 hover:bg-blue-700 text-cyan-200 hover:text-white rounded-md border border-blue-500/40 transition-colors",
                          nav_button_previous: "absolute left-1",
                          nav_button_next: "absolute right-1",
                          table: "w-full border-collapse space-y-1",
                          head_row: "flex",
                          head_cell: "text-cyan-300 rounded-md w-9 font-medium text-[0.8rem]",
                          row: "flex w-full mt-2",
                          cell: "h-9 w-9 text-center text-sm p-0 relative",
                          day: "h-9 w-9 p-0 font-medium rounded-md transition-all text-blue-100 hover:bg-blue-600/60 hover:text-white",
                          day_selected: "bg-cyan-500 text-white hover:bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.6)]",
                          day_today: "ring-2 ring-cyan-400 text-cyan-200",
                          day_outside: "text-blue-700/40",
                          day_disabled: "text-blue-800/40 opacity-40 hover:bg-transparent cursor-not-allowed",
                          day_hidden: "invisible",
                        }}
                      />
                    </div>

                    {/* Time slots */}
                    <div>
                      <p className="text-sm text-blue-200/70 mb-3">
                        {selectedDate 
                          ? `Créneaux disponibles le ${format(selectedDate, 'EEEE d MMMM', { locale: fr })}`
                          : 'Sélectionnez une date pour voir les créneaux'
                        }
                      </p>
                      
                      {selectedDate && (
                        <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto pr-2" role="group" aria-label="Créneaux horaires disponibles">
                          {TIME_SLOTS.map((time) => {
                            const available = isSlotAvailable(time);
                            return (
                              <button
                                key={time}
                                type="button"
                                disabled={!available}
                                onClick={() => setSelectedTime(time)}
                                aria-label={`${available ? 'Sélectionner' : 'Indisponible :'} ${time}`}
                                aria-pressed={selectedTime === time}
                                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                                  selectedTime === time
                                    ? 'bg-blue-500 text-white'
                                    : available
                                    ? 'bg-blue-900/50 text-white hover:bg-blue-800/50 border border-blue-500/20'
                                    : 'bg-blue-950/30 text-blue-500/30 cursor-not-allowed line-through'
                                }`}
                              >
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setStep(1)}
                      className="bg-blue-800/80 text-white border border-blue-400/50 hover:bg-blue-700/80"
                    >
                      Retour
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setStep(3)}
                      disabled={!selectedDate || !selectedTime}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50"
                    >
                      Continuer
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact info */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-400" />
                    Vos coordonnées
                  </h3>

                  {/* Summary */}
                  <div className="bg-blue-900/30 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-blue-200">
                      <span className="font-medium">Récapitulatif :</span>{' '}
                      Appel de {selectedDuration} min le{' '}
                      <span className="text-white font-medium">
                        {selectedDate && format(selectedDate, 'EEEE d MMMM', { locale: fr })}
                      </span>{' '}
                      à <span className="text-white font-medium">{selectedTime}</span>
                    </p>
                  </div>

                    <div className="grid gap-4">
                    <div>
                      <Label htmlFor="name" className="text-blue-200 flex items-center gap-2 mb-2">
                        <User className="w-4 h-4" /> Nom complet <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jean Dupont"
                        required
                        aria-required="true"
                        className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-blue-300/40"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-blue-200 flex items-center gap-2 mb-2">
                        <Mail className="w-4 h-4" /> Email <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jean@example.com"
                        required
                        aria-required="true"
                        className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-blue-300/40"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-blue-200 flex items-center gap-2 mb-2">
                        <Phone className="w-4 h-4" /> Téléphone <span className="text-red-400">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="06 12 34 56 78"
                        required
                        aria-required="true"
                        className="bg-blue-900/30 border-blue-500/30 text-white placeholder:text-blue-300/40"
                      />
                    </div>
                  </div>

                    <div className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      className="bg-blue-800/80 text-white border border-blue-400/50 hover:bg-blue-700/80"
                    >
                      Retour
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 shadow-[0_0_20px_rgba(59,130,246,0.4)]"
                    >
                      {isSubmitting ? 'Réservation...' : 'Confirmer la réservation'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
