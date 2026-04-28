# Supabase Email Invitation Limits & Solutions

## The Issue: "Rate Limit Exceeded" on Invites

When adding a new Doctor (or any user) via Supabase's `admin.inviteUserByEmail` function, you might
hit a limit very quickly, especially when testing with the same email address.

## Is this normal?

**Yes, absolutely.** Supabase enforces strict anti-spam rate limits on their default built-in email
server.

### The Default Free-Tier Limits:

1. **Same Email Limit:** You can usually only send **2 to 3 emails per hour** to the exact same
   email address.
2. **Global Limit:** The default Supabase SMTP server limits you to **30 emails per hour** total
   across your entire project.

If you are testing by repeatedly deleting and re-inviting the same `myemail@gmail.com`, you will hit
the "Too Many Requests" error almost immediately.

---

## How to Fix It

### 1. For Immediate Testing (The "Plus" Trick)

If you use Gmail or a modern email provider, you can add a `+` and a number to your email address.
Supabase treats them as brand new unique emails, but they all go to the same inbox.

- `myemail@gmail.com` (Hits limit after 3)
- `myemail+doc1@gmail.com` (Brand new!)
- `myemail+doc2@gmail.com` (Brand new!)

### 2. For Production (Custom SMTP - Required)

You cannot use the default Supabase email server for a real clinic in production. You must configure
a **Custom SMTP Provider**.

- Go to **Supabase Dashboard -> Authentication -> Providers -> Email**.
- Scroll down to **Custom SMTP**.
- Plug in credentials from a service like **Resend**, **SendGrid**, or **Postmark**.
- _Result:_ The 30/hour global limit is removed, and you inherit the high limits of your SMTP
  provider. (Note: Supabase still maintains a "same email" rate limit for security, but Custom SMTP
  handles the global capacity).

## The Ultimate Solution: "Custom Invitation Flow" (Recommended)

If you want to completely bypass Supabase's default email sending and have 100% control over the
"Create Your Password" experience, build a custom invite API route.

### How it works:

1. **Admin Fills Form:** Admin enters the Doctor's Name, Email, and Specialization in the frontend
   and submits.
2. **Backend Creates User (Silently):** Your Node.js backend uses the Supabase Admin API to create
   the account with a random temporary password, skipping the email confirmation.
    ```javascript
    const { data: user, error: userError } = await supabaseAdmin.auth.admin.createUser({
        email: req.body.email,
        password: crypto.randomBytes(16).toString('hex'), // Random temp password
        email_confirm: true,
        user_metadata: {
            role: 'dentist',
            full_name: req.body.fullName,
            specialization: req.body.specialization,
        },
    });
    ```
3. **Backend Generates an Action Link (No Email Sent Yet):** Instead of asking Supabase to send an
   email, you ask Supabase to just _generate the link_ that allows the user to set their password.
    ```javascript
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'invite',
        email: req.body.email,
    });
    // linkData.properties.action_link -> "https://primeradental.com/auth/set-password?token=..."
    ```
4. **Backend Sends Custom Email (via Resend/Nodemailer):** You take that link and inject it into
   your own beautifully designed HTML email, then send it using your own email provider limit (e.g.,
   Resend).
    ```javascript
    await resend.emails.send({
        from: 'admin@primeradental.com',
        to: req.body.email,
        subject: 'Welcome to Primera Dental! Set your password',
        html: `
        <h1>Welcome Dr. ${req.body.fullName},</h1>
        <p>You have been added to the Primera Dental system.</p>
        <a href="${linkData.properties.action_link}">Click here to create your password and log in</a>
      `,
    });
    ```
5. **Doctor Sets Password:** The doctor clicks the link in their email, lands on your
   `/auth/set-password` page, types their chosen password, and logs in!

**Why this is perfect:**

- Zero Supabase email limits (you only use your Resend email limits).
- Admin does the setup, Doctor only has to think about their password.
- 100% control over the email design.
