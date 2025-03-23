import { FC } from "react";
import { Shield, Lock } from "lucide-react";
import { locale } from "./locale";

export const AccessDenied: FC = () => {
  return (
    <div className="container mx-auto max-w-6xl py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Shield className="h-10 w-10 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            {locale.accessDenied.title}
          </h2>

          <p className="text-gray-600 mb-2 max-w-md">
            {locale.accessDenied.message}
          </p>

          <p className="text-gray-500 text-sm mb-8 max-w-md">
            {locale.accessDenied.secondaryMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
