import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'test_key')

export interface EmailData {
  weddingTitle: string
  coupleEmail: string
  coupleNames: string
  guestName: string
  message?: string
  attachments: {
    filename: string
    content: Buffer
    contentType: string
  }[]
}

export async function sendWeddingMoment(data: EmailData) {
  const { weddingTitle, coupleEmail, coupleNames, guestName, message, attachments } = data
  
  // За тестирање без вистински API key
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'test_key_za_razvoj') {
    console.log('🧪 TEST EMAIL - би се испратил до:', coupleEmail)
    console.log('📧 Гост:', guestName)
    console.log('💬 Порака:', message || 'Нема порака')
    console.log('📎 Прикачувања:', attachments.length, 'датотеки')
    
    // Симулирај успешно праќање
    return { success: true, messageId: 'test_message_' + Date.now() }
  }
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #f472b6, #a855f7); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">💕 Нов момент од вашата свадба!</h1>
      </div>
      
      <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Драги ${coupleNames},</h2>
        
        <p style="color: #666; font-size: 16px; line-height: 1.6;">
          <strong>${guestName}</strong> сподели прекрасен момент од вашата свадба "${weddingTitle}"!
        </p>
        
        ${message ? `
          <div style="background: #f8fafc; padding: 15px; border-left: 4px solid #f472b6; margin: 20px 0;">
            <p style="margin: 0; font-style: italic; color: #555;">
              "${message}"
            </p>
          </div>
        ` : ''}
        
        <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">📎 Прикачени датотеки:</h3>
          <ul style="color: #666;">
            ${attachments.map(att => `<li>${att.filename}</li>`).join('')}
          </ul>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #888; font-size: 14px; margin: 0;">
            Испратено од WeddingMoments апликацијата<br>
            <span style="color: #f472b6;">💕 Сочувајте ги моментите засекогаш 💕</span>
          </p>
        </div>
      </div>
    </div>
  `

  try {
    const result = await resend.emails.send({
      from: process.env.APP_EMAIL!,
      to: [coupleEmail],
      subject: `💕 ${guestName} сподели момент од вашата свадба "${weddingTitle}"`,
      html: emailContent,
      attachments: attachments.map(att => ({
        filename: att.filename,
        content: att.content
      }))
    })

    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}