import { TeamModel } from './types';
import { Error404 } from '../error';

export namespace Statics {
  /**
   * Accepts invite - moves user from pending to roster
   */
  export async function invite(
    this: TeamModel,
    teamId: string, 
    userId: string, 
    accepted: boolean
  ) {
    const team = await this.findById(teamId, 'roster pending');
    if (!team) {
      throw new Error404('Team not found');
    }
    
    const match = team.pending.find((p: any) => p.user.toString() === userId);
    if (!match) { return; }
  
    team.pending = team.pending.filter((p: any) => p.user.toString() === userId);
  
    if (accepted) { team.roster.push(match); }
  
    await team.save();
  }
}