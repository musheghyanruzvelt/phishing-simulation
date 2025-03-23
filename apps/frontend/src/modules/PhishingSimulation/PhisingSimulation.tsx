import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePhishingQuery } from "@/services/phishing/usePhishingQuery";
import { PhishingEmailRequest } from "@/services/phishing/Phishing.types";
import { tokenService } from "@/common/tokenService";
import { toast } from "sonner";
import { locale } from "./locale";

export const PhishingSimulation = () => {
  const user = tokenService.getUserData();

  const { useSendPhishingMutation } = usePhishingQuery();
  const {
    mutateAsync: sendPhishingEmail,
    error,
    isPending,
  } = useSendPhishingMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PhishingEmailRequest>({
    defaultValues: {
      recipientEmail: "",
      emailTemplate: "",
    },
  });

  const onSubmit = async (data: PhishingEmailRequest) => {
    await sendPhishingEmail({ ...data, createdBy: user?.id as string });
    toast(locale.successToast);
    reset({});
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">{locale.title}</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600 mb-4">{locale.description}</p>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded border border-red-200">
            {locale.errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="recipientEmail">{locale.targetEmailLabel}</Label>
            <Input
              id="recipientEmail"
              type="email"
              placeholder={locale.targetEmailPlaceholder}
              {...register("recipientEmail", {
                required: locale.emailRequiredError,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: locale.invalidEmailError,
                },
              })}
            />
            {errors.recipientEmail && (
              <p className="text-sm text-red-500">
                {errors.recipientEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailTemplate">{locale.emailContentLabel}</Label>
            <Textarea
              id="emailTemplate"
              rows={6}
              placeholder={locale.emailContentPlaceholder}
              {...register("emailTemplate", {
                required: locale.emailContentRequiredError,
                maxLength: {
                  value: 500,
                  message: locale.emailContentMaxLengthError,
                },
              })}
            />
            {errors.emailTemplate && (
              <p className="text-sm text-red-500">
                {errors.emailTemplate.message}
              </p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {locale.emailContentNote}
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? locale.sendingButton : locale.submitButton}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PhishingSimulation;
