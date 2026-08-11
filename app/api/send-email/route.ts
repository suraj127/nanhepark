import { NextRequest, NextResponse } from 'next/server';
import { CombinedEmailPayload } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const payload: CombinedEmailPayload = body.payload;

    if (!payload || !payload.toEmails || payload.toEmails.length === 0) {
      return NextResponse.json({ error: 'Invalid email payload or missing recipient addresses.' }, { status: 400 });
    }

    // Build Gmail Compose Web Link (Web mailto helper for instant resident launch)
    const toJoined = encodeURIComponent(payload.toEmails.join(','));
    const ccJoined = encodeURIComponent(payload.ccEmails.join(','));
    const subjectEncoded = encodeURIComponent(payload.subject);
    const bodyEncoded = encodeURIComponent(payload.bodyMarkdown);

    const gmailWebLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${toJoined}&cc=${ccJoined}&su=${subjectEncoded}&body=${bodyEncoded}`;
    const mailtoStandardLink = `mailto:${toJoined}?cc=${ccJoined}&subject=${subjectEncoded}&body=${bodyEncoded}`;

    // Simulate official dispatch logging
    const dispatchTimestamp = new Date().toISOString();
    const dispatchId = `CIVIC-DISPATCH-${Date.now().toString(36).toUpperCase()}`;

    // Return official success response
    return NextResponse.json({
      success: true,
      dispatchId,
      dispatchTimestamp,
      summary: {
        toCount: payload.toEmails.length,
        ccCount: payload.ccEmails.length,
        totalUniqueRecipients: payload.toEmails.length + payload.ccEmails.length,
        deduplicatedRemovedCount: payload.deduplicationAudit.removedDuplicates.length,
        departmentsCount: payload.departmentMatrix.length,
        attachedPhotosCount: payload.watermarkedImages.length
      },
      links: {
        gmailWebLink,
        mailtoStandardLink
      },
      message: 'Multiple civic issues and departments were included in a single official email.'
    });
  } catch (err: any) {
    console.error('Error in /api/send-email:', err);
    return NextResponse.json({ error: err.message || 'Failed to dispatch official email.' }, { status: 500 });
  }
}
