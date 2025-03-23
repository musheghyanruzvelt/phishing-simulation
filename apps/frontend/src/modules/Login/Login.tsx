import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/router/routes";
import { useAuthQuery } from "@/services/auth/useAuthQuery";
import { LoginRequest } from "@/services/auth/Auth.types";
import { locale } from "./locale";

export const Login = () => {
  const { useLoginMutation } = useAuthQuery();

  const { mutateAsync: login, isPending, error } = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="space-y-6 bg-white p-6 shadow-md rounded-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{locale.title}</h1>
          <p className="text-sm text-gray-500 mt-2">{locale.description}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{locale.form.email.label}</Label>
            <Input
              id="email"
              type="email"
              placeholder={locale.form.email.placeholder}
              {...register("email", {
                required: locale.form.email.required,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: locale.form.email.invalid,
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{locale.form.password.label}</Label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={locale.form.password.placeholder}
              {...register("password", {
                required: locale.form.password.required,
                minLength: {
                  value: 6,
                  message: locale.form.password.minLength,
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500">
              {error.response?.data?.message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer"
            disabled={isPending}
          >
            {isPending
              ? locale.form.buttons.pending
              : locale.form.buttons.submit}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p>
            {locale.register.text}{" "}
            <Link
              to={`/${ROUTES.REGISTER}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {locale.register.link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
