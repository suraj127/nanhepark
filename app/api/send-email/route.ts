import { NextRequest, NextResponse } from 'next/server';
import { CombinedEmailPayload } from '@/lib/types';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: CombinedEmailPayload = body.payload;

    if (!payload || !payload.toEmails || payload.toEmails.length === 0) {
      return NextResponse.json({ error: 'Invalid email payload or missing recipient addresses.' }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const hasSmtpConfig = Boolean(smtpUser && smtpPass);

    let serverDispatched = false;
    let serverMessage = '';

    // MODE 1: Direct Server-Side Email Dispatch via Nodemailer (with REAL Attached Files)
    if (hasSmtpConfig) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        // Convert base64 data URLs into real email file attachments
        const attachments = (payload.watermarkedImages || [])
          .filter((img) => img.dataUrl && img.dataUrl.startsWith('data:image'))
          .map((img, idx) => {
            const base64Data = img.dataUrl.split(',')[1];
            return {
              filename: `Watermarked_Evidence_Photo_${idx + 1}.jpg`,
              content: base64Data,
              encoding: 'base64',
              contentType: 'image/jpeg'
            };
          });

        await transporter.sendMail({
          from: `"Nanhey Park Civic Watch" <${smtpUser}>`,
          to: payload.toEmails.join(', '),
          cc: payload.ccEmails.join(', '),
          subject: payload.subject,
          text: payload.bodyMarkdown,
          html: payload.bodyHtml,
          attachments
        });

        serverDispatched = true;
        serverMessage = 'Official complaint email with watermarked evidence photos attached was sent automatically!';
      } catch (smtpErr: any) {
        console.warn('[Civic Watch] Nodemailer SMTP dispatch fallback:', smtpErr?.message || smtpErr);
      }
    }

    // MODE 2: Build Gmail & Mailto Links (Fallback for client launch)
    const toJoined = payload.toEmails.join(',');
    const ccJoined = payload.ccEmails.join(',');
    const subjectEncoded = encodeURIComponent(payload.subject);

    const primaryIssue = payload.detectedIssues[0];
    const compactBody = `Respected Sir/Madam,

This is an urgent official civic complaint regarding ${primaryIssue?.issueName || 'Civic Infrastructure Deficit'} at:
Location: ${payload.location.address}
GPS: ${payload.location.latitude}, ${payload.location.longitude}
Date: ${payload.dateTimeFormatted}

Primary Issue: ${primaryIssue?.issueName} (${primaryIssue?.departmentName})
Required Action: ${primaryIssue?.requiredAction}

Concerned departments are requested to resolve immediately.

Regards,
Nanhey Park Civic Watch (E Block, Matiala, New Delhi)`;

    const bodyEncoded = encodeURIComponent(compactBody);

    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(toJoined)}&cc=${encodeURIComponent(ccJoined)}&su=${subjectEncoded}&body=${bodyEncoded}`;
    const mailtoStandardLink = `mailto:${toJoined}?cc=${ccJoined}&subject=${subjectEncoded}&body=${bodyEncoded}`;

    const dispatchTimestamp = new Date().toISOString();
    const dispatchId = `CIVIC-DISPATCH-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      serverDispatched,
      dispatchId,
      dispatchTimestamp,
      summary: {
        toCount: payload.toEmails.length,
        ccCount: payload.ccEmails.length,
        totalUniqueRecipients: payload.toEmails.length + payload.ccEmails.length,
        attachedPhotosCount: (payload.watermarkedImages || []).length
      },
      links: {
        gmailWebLink,
        mailtoStandardLink
      },
      message: serverDispatched ? serverMessage : 'Email prepared with nodal contacts.'
    });
  } catch (err: any) {
    console.error('Error in /api/send-email:', err);
    return NextResponse.json({ error: err.message || 'Failed to process email dispatch.' }, { status: 500 });
  }
}
