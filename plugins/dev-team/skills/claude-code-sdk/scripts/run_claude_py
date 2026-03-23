#!/home/node/.openclaw/.venv/bin/python

import asyncio
from claude_agent_sdk import query, ClaudeAgentOptions, SystemMessage, ResultMessage, AssistantMessage, TextBlock


async def main(args):

    try:
        res = None
        async for message in query(
            prompt=args.query,
            options=ClaudeAgentOptions(
                cwd=args.cwd,
                system_prompt=args.append_system_prompt,
                setting_sources=["user", "project"],
                resume=args.resume,
                allowed_tools=["Read", "Edit", "Bash",
                               "Write", "Glob", "Grep", "Skill"]
            ),
        ):
            if isinstance(message, SystemMessage):
                if args.log_file:
                    session_id = message.data["session_id"]
                    with open(args.log_file, mode="w") as f:
                        f.write(
                            f"Session ID: {session_id}\n\n")
            elif isinstance(message, ResultMessage):
                res = message.result + "\nResume this session with id: " + message.session_id
            elif isinstance(message, AssistantMessage):
                if not args.log_file:
                    continue
                for block in message.content:
                    if isinstance(block, TextBlock):
                        with open(args.log_file, mode="a") as f:
                            f.write(block.text + "\n\n")
        print(res)
    except Exception as e:
        print("Claude Code execution failed: " + str(e))


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--query", type=str, required=True,
                        help="The query to send to Claude Code")
    parser.add_argument("--cwd", type=str, required=False,
                        help="Working directory for Claude Code")
    parser.add_argument("--resume", type=str, required=False,
                        help="The session id to resume")
    parser.add_argument("--log-file", type=str, required=False,
                        help="The file to store the intermediate outputs")
    parser.add_argument("--append-system-prompt", type=str, required=False,
                        help="The prompt to send to Claude")
    args = parser.parse_args()
    asyncio.run(main(args))
