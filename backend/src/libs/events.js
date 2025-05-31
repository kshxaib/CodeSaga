import EventEmitter from 'events';
import { db } from './db.js'; 

class InvitationEventEmitter extends EventEmitter {}
const invitationEvents = new InvitationEventEmitter();

invitationEvents.on('invitationCreated', async (invitation) => {
  try {
    const sender = await db.user.findUnique({
      where: { id: invitation.senderId },
      select: { username: true, image: true }
    });

    const receiver = await db.user.findUnique({
      where: { id: invitation.receiverId },
      select: { username: true }
    });

    console.log(`New invitation from ${sender?.username} to ${receiver?.username}`);
  } catch (error) {
    console.error('Error handling invitation creation event:', error);
  }
});

invitationEvents.on('invitationStatusUpdated', async (invitation) => {
  if(invitation.status !== "ACCEPTED") return
  try {
    const maxCollaborators = 5

    let collaboration = await db.problemCollaboration.findFirst({
      where: { problemId: invitation.problemId, initiatorId: invitation.senderId },
      include: { participants: true }
    });

    if (collaboration && collaboration.participants.length >= maxCollaborators) {
      await prisma.problemInvitation.update({
        where: { id: invitation.id },
        data: { status: 'DECLINED' }
      });
      return;
    }

     if (!collaboration) {
      collaboration = await prisma.problemCollaboration.create({
        data: {
          problemId: invitation.problemId,
          initiatorId: invitation.senderId,
          participants: { connect: [{ id: invitation.senderId }] },
          maxParticipants: maxCollaborators,
          currentCode: '',
          language: 'JAVASCRIPT'
        },
        include: { participants: true }
      });
    }

     await db.problemCollaboration.update({
      where: { id: collaboration.id },
      data: {
        participants: { connect: [{ id: invitation.receiverId }] }
      }
    });

    const sender = await db.user.findUnique({
        where: { id: invitation.senderId },
        select: { username: true, id: true }
    });
    
    const receiver = await db.user.findUnique({
        where: { id: invitation.receiverId },
        select: { username: true, id: true }
    });

        io.to(`user:${sender.id}`).emit('collaborationStarted', {
            problemId: problem.id,
            collaborationId: collaboration.id,
            participants: [sender.id, receiver.id],
        });

        io.to(`user:${receiver.id}`).emit('collaborationStarted', {
        problemId: problem.id,
        collaborationId: collaboration.id,
        participants: [sender, receiver]
      });
    }

   catch (error) {
    console.error('Error handling invitation status update event:', error);
  }
});

export { invitationEvents };