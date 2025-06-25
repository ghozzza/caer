import { Card } from "@/components/ui/card";
import React from "react";
import FaucetsCardHeader from "./faucets-header";
import FaucetsCardForm from "./faucets-form";

const FaucetsCard = () => {
  return (
    <div>
      <Card className="bg-white border-[#01ECBE]/30 shadow-xl overflow-hidden">
        <FaucetsCardHeader />
        <FaucetsCardForm />
      </Card>
    </div>
  );
};

export default FaucetsCard;
