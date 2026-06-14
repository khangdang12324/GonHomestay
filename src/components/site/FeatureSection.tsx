import { Car, DoorOpen, Flame, Home, Trees, Users, Wifi } from "lucide-react";
import { features } from "@/data/constants";

const icons = [Home, DoorOpen, Trees, Users, Flame, Wifi, Car];

export function FeatureSection() {
  return (
    <section className="bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={feature}
                className="rounded-lg border border-[#e5d8c5] bg-[#fffaf2] p-4"
              >
                <Icon className="text-[#2f5d46]" size={24} />
                <p className="mt-3 text-sm font-semibold text-[#2f241b]">{feature}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
