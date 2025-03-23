import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/router/routes";
import { useAuthQuery } from "@/services/auth/useAuthQuery";
import { RegisterRequest, UserRole } from "@/services/auth/Auth.types";
import { locale } from "./locale";

export const Register = () => {
  const { useRegisterMutation } = useAuthQuery();

  const { mutateAsync: registerFn, isPending, error } = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: Omit<RegisterRequest, "role">) => {
    await registerFn({
      email: data.email,
      password: data.password,
      role: UserRole.ADMIN,
    });
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
            <Label htmlFor="password">{locale.form.password.label}</Label>
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

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {locale.form.confirmPassword.label}
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={locale.form.confirmPassword.placeholder}
              {...register("confirmPassword", {
                required: locale.form.confirmPassword.required,
                validate: (value) =>
                  value === password || locale.form.confirmPassword.mismatch,
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
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
            {locale.login.text}{" "}
            <Link
              to={`/${ROUTES.LOGIN}`}
              className="text-blue-600 hover:underline font-medium"
            >
              {locale.login.link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
