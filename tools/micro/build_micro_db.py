#!/usr/bin/env python3
"""
Bootstrap micro tables in svc_realtime.db.
"""

from __future__ import annotations

from _micro_common import connect_db, dedupe_micro_tables, ensure_micro_schema


def main() -> None:
    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        dedupe_micro_tables(conn)
        conn.commit()
    finally:
        conn.close()
    print("micro schema ready (dedupe applied)")


if __name__ == "__main__":
    main()
