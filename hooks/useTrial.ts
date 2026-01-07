import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TRIAL_START_DATE_KEY = "trial_start_date";
const TRIAL_DURATION_DAYS = 7;

export const useTrial = () => {
  const [trialStartDate, setTrialStartDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [isTrialActive, setIsTrialActive] = useState<boolean>(false);
  const [isTrialExpired, setIsTrialExpired] = useState<boolean>(false);

  useEffect(() => {
    initializeTrial();
  }, []);

  useEffect(() => {
    if (trialStartDate) {
      calculateTrialStatus();
    }
  }, [trialStartDate]);

  const initializeTrial = async () => {
    try {
      const storedStartDate = await AsyncStorage.getItem(TRIAL_START_DATE_KEY);
      
      if (storedStartDate) {
        // Trial already started
        setTrialStartDate(new Date(storedStartDate));
      } else {
        // Start new trial
        const now = new Date();
        await AsyncStorage.setItem(TRIAL_START_DATE_KEY, now.toISOString());
        setTrialStartDate(now);
      }
    } catch (error) {
      console.error("Error initializing trial:", error);
      // Fallback to current date if there's an error
      const now = new Date();
      setTrialStartDate(now);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTrialStatus = () => {
    if (!trialStartDate) return;

    const now = new Date();
    const daysPassed = Math.floor(
      (now.getTime() - trialStartDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    const remaining = Math.max(0, TRIAL_DURATION_DAYS - daysPassed);
    
    setDaysRemaining(remaining);
    setIsTrialActive(remaining > 0);
    setIsTrialExpired(remaining === 0 && daysPassed >= TRIAL_DURATION_DAYS);
  };

  const resetTrial = async () => {
    try {
      await AsyncStorage.removeItem(TRIAL_START_DATE_KEY);
      const now = new Date();
      await AsyncStorage.setItem(TRIAL_START_DATE_KEY, now.toISOString());
      setTrialStartDate(now);
    } catch (error) {
      console.error("Error resetting trial:", error);
    }
  };

  const getTrialEndDate = (): Date | null => {
    if (!trialStartDate) return null;
    
    const endDate = new Date(trialStartDate);
    endDate.setDate(endDate.getDate() + TRIAL_DURATION_DAYS);
    return endDate;
  };

  const getHoursRemaining = (): number => {
    if (!trialStartDate || !isTrialActive) return 0;
    
    const now = new Date();
    const endDate = getTrialEndDate();
    if (!endDate) return 0;
    
    const hoursRemaining = Math.max(0, 
      Math.floor((endDate.getTime() - now.getTime()) / (1000 * 60 * 60))
    );
    
    return hoursRemaining;
  };

  return {
    trialStartDate,
    daysRemaining,
    isTrialActive,
    isTrialExpired,
    isLoading,
    resetTrial,
    getTrialEndDate,
    getHoursRemaining,
    trialDurationDays: TRIAL_DURATION_DAYS,
  };
};