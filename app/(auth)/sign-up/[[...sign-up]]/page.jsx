import { SignUp } from "@clerk/nextjs"

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Join CookSmartAI</h2>
          <p className="mt-2 text-sm text-gray-600">Create your account and start cooking smarter with AI</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-gradient-to-r from-orange-500 to-green-500 hover:from-orange-600 hover:to-green-600 text-sm normal-case",
              card: "shadow-lg border-0",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton: "border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900",
              formFieldInput: "border-gray-300 focus:border-orange-500 focus:ring-orange-500",
              footerActionLink: "text-orange-600 hover:text-orange-700",
            },
          }}
        />
      </div>
    </div>
  )
}
