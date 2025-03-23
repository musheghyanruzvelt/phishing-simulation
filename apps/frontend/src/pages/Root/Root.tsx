import { useState } from "react";
import PhishingAttemptsList from "@/modules/PhishingAttemptsList/PhishingAttemtsList";
import PhishingSimulation from "@/modules/PhishingSimulation/PhisingSimulation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAB } from "./Root.constants";
import { Toaster } from "@/components/ui/sonner";

export const Root = () => {
  const [activeTab, setActiveTab] = useState(TAB.ATTEMPTS);

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Phishing Simulation Dashboard
      </h1>

      <Tabs
        defaultValue={TAB.ATTEMPTS}
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-center mb-8">
          <TabsList>
            <TabsTrigger value={TAB.ATTEMPTS} className="px-8 cursor-pointer">
              Phishing Attempts
            </TabsTrigger>
            <TabsTrigger value={TAB.SIMULATION} className="px-8 cursor-pointer">
              Create Simulation
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={TAB.ATTEMPTS} className="mt-0">
          <PhishingAttemptsList />
        </TabsContent>

        <TabsContent value={TAB.SIMULATION} className="mt-0">
          <PhishingSimulation />
        </TabsContent>
      </Tabs>
      <Toaster />
    </div>
  );
};
