"use client";
import { Modal } from "@/components/utils/modal";
import { Button } from "@/components/utils/button"; 
import { useContextSafely } from "@/hooks/use-context-safely";
import { UserContext } from "@/contexts/user-context";
import { AlertsContext, AlertsContextProvider } from "@/contexts/alerts-context";
import { calculateDaysRemaining } from "@/app/progress/calculate-days-remaining";
import { useState } from "react";
import { UserContextProvider } from '@/contexts/user-context/user-context-provider';

export function RestartChallengeModal() {
  const [isLoading, setLoading] = useState(false);

  const { restartChallenge, user } = useContextSafely(UserContext, "RestartChallengeModal");
  const { showAlert } = useContextSafely(AlertsContext, "RestartChallengeModal");

  if (!user) return null;
  const showModal = calculateDaysRemaining(user) === 0;

  const restartAndChangeisLoading = async () => {
    try {
      setLoading(true);
      await restartChallenge();
    } catch (error) {
      showAlert("Failed to restart the challenge. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (

        <Modal ariaLabel="Restart Challenge" theme="dark" isOpen={showModal} closeModal={() => {}}>
   
              
          {isLoading ? (
            <p>Restarting your challenge...</p>
          ) : (
            <>
              <p>Oops, times up! But no worries, restart your challenge to continue!</p>
              <Button
                onClick={restartAndChangeisLoading}
                size="sm"
                style={{ marginTop: '16px' }}
              >
                Restart Challenge
              </Button>
            </>
          )}

        </Modal>


  );
}