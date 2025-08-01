import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "./prisma"

export const checkUser = async () => {
  const user = await currentUser()
  if (!user) {
    return null
  }

  try {
    const loggedInUser = await prisma.user.findUnique({
      where: {
        clerkId: user.id,
      },
    })

    if (loggedInUser) {
      return loggedInUser
    }

    const name = `${user.firstName} ${user.lastName}`
    const newUser = await prisma.user.create({
      data: {
        clerkId: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    })
    return newUser
  } catch (error) {
    console.log(error.message)
    return null
  }
}
