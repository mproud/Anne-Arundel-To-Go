import { drainFormOutbox } from '../lib/form-outbox'

export default {
    async scheduled(_event: ScheduledController, env: { FORM_DB: D1Database }) {
        const checked = await drainFormOutbox(env.FORM_DB)
        console.log('Form outbox checked submissions:', checked)
    },
}
