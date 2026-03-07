#!/usr/bin/env python3
"""
Bootstrap micro tables in svc_realtime.db.
"""

from __future__ import annotations

from _micro_common import connect_db, ensure_micro_schema


def main() -> None:
    conn = connect_db()
    try:
        ensure_micro_schema(conn)
        conn.commit()
    finally:
        conn.close()
    print("micro schema ready")


if __name__ == "__main__":
    main()
