# -*- coding: utf-8 -*-
"""
CV-PDF-Maker.py の使い方
履歴書生成プログラム

概要
このプログラムを実行すると、同じフォルダに「■■■■履歴書■■■■.pdf」が自動生成されます

【事前準備】

プログラムと同じフォルダに証明写真を photo.jpg という名前で保存する
プログラム内の「編集用データ」セクションを自分の内容（氏名・住所・電話番号・メールアドレスなど）に書き換える

【実行方法（いずれか一つでOK）】

VSCode右上の実行ボタンを押す
F5 キーを押す
ターミナルで python CV-PDF-Maker.py を実行する

【必要ライブラリ】

pip install reportlab pillow
日本語フォントはreportlab内蔵のCIDフォントを使うので、別途フォントファイルの用意は不要です

【運用上のコツ】
志望動機・自己PR欄はPDF生成後に見た目を確認し、違和感があれば改行位置に \n を入れて都度読みやすく調整していく

"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.utils import ImageReader


# ============================================================
#  編集用データ（ここを書き換えれば内容が変わります）
# ============================================================

# ---- 基本情報 -------------------------------------------------
FURIGANA_NAME = "■■■■　■■"
FULL_NAME = "■■　■■"
BIRTH_DATE_TEXT = "生年月日：▽▽▽▽年▽月▽日"
GENDER = "？性"

FURIGANA_ADDRESS = "■■■■■■"
POSTAL_CODE = "■■■■■■■■"
ADDRESS_LINE = "■■■■■■■■"

# ---- 電話番号・メールアドレス欄 -------------------
# ここに書いた内容がそのまま履歴書に印字されます。
# あとで書き換えたいときは、この2行を編集するだけでOKです。
PHONE_NUMBER = "■■■■■■■■"          # ← 例：あとで自分の電話番号に書き換える
EMAIL_ADDRESS = "■■■■■■■■"   # ← 例：あとで自分のメールアドレスに書き換える

# ---- 日付（右上に印字される作成日） ---------------------------
DOCUMENT_DATE_TEXT = "2026年7月24日現在"

# ---- 写真ファイル名（同じフォルダに置くこと） -------------------
PHOTO_FILENAME = "photo.jpg"

# ---- 学歴・職歴 -------------------------------------------------
# ("年", "月", "内容", 種別)
#   種別 "section" = 中央寄せの見出し行（学歴／職歴 など）
#   種別 "item"    = 通常の1行
#   種別 "blank"   = 空白の1行
GAKUREKI_SHOKUREKI = [
    ("", "", "学歴", "section"),
    ("■■■■■", "04", "■■■■■■■■", "item"),
    ("■■■■■", "03", "■■■■■■■■科　卒業", "item"),
    ("■■■■■", "04", "■■■■■■■■科　入学", "item"),
    ("■■■■■", "03", "■■■■■■■■科　卒業", "item"),
    ("", "", "", "blank"),
    ("", "", "", "blank"),
    ("", "", "職歴", "section"),
    ("■■■■", "■■", "■■■■■■■■■■■■■", "item"),
    ("■■■■", "■■", "■■■■■■■■", "item"),
    ("■■■■", "■■", "■■■■■■■■", "item"),
    ("■■■■", "■■", "■■■■■■■■", "item"),
    ("■■■■", "■■", "■■■■■■■■", "item"),
    ("■■■■", "■■", "■■■■■■■■", "item"),
]

# 2ページ目に続く学歴・職歴
GAKUREKI_SHOKUREKI_PAGE2 = [
    ("", "", "", "blank"),
    ("", "", "", "blank"),
    ("", "", "", "blank"),
    ("", "", "", "blank"),
]

# ---- 免許・資格 -------------------------------------------------
MENKYO_SHIKAKU = [
    ("■■■■", "■■", "■■■■■■■■■■　取得"),
    ("■■■■", "■■", "■■■■■■■■■■■■■■　合格"),
    ("■■■■", "■■", "■■■■■■■■■■■■■■■■■■　取得"),
    ("■■■■", "■■", "■■■■■■■■■■ 合格")
]

# ---- 志望の動機、特技、好きな学科、アピールポイントなど ----------
# ★ 2ページ目のこの欄は「志望動機」と「自己PR・自己研鑽」の上下2段に分割している。
#   MOTIVATION_TEXT   … 上段（志望動機）に印字される文章
#   SELF_PR_TEXT      … 下段（自己PR・自己研鑽）に印字される文章

MOTIVATION_TEXT = (
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "\n■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
)



SELF_PR_TEXT = (
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■"
    "■■■■■■■■■■。"
)


# ---- 本人希望記入欄 ----------------------------------------------
# 元の文字列（基本的に、文面は『貴社規定に従います』を記入しておく。）
REQUEST_TEXT = (
    "貴社規定に従います。"
)


# 出力ファイル名
OUTPUT_FILENAME = "■■■■履歴書■■■■.pdf"


# ============================================================
#  フォント準備（reportlab内蔵の日本語CIDフォント。追加ダウンロード不要）
# ============================================================
FONT_GOTHIC = "HeiseiKakuGo-W5"   # ゴシック体（見出し・太字っぽい用途）
FONT_MINCHO = "HeiseiMin-W3"      # 明朝体（本文用途）

pdfmetrics.registerFont(UnicodeCIDFont(FONT_GOTHIC))
pdfmetrics.registerFont(UnicodeCIDFont(FONT_MINCHO))


# ============================================================
#   -- レイアウト設定エリア --
# ============================================================
PAGE_W, PAGE_H = A4


def y_from_top(mm_from_top):
    """ページ上端からの距離(mm)を、reportlabの下端基準yに変換する"""
    return PAGE_H - mm_from_top * mm


def x_from_left(mm_from_left):
    """ページ左端からの距離(mm)をxに変換する"""
    return mm_from_left * mm


def draw_text(c, x_mm, y_mm_from_top, text, font=FONT_GOTHIC, size=10.5,
              align="left", color=(0, 0, 0)):
    """左端x(mm)・上端からの距離y(mm)を基準に文字を描画する"""
    c.setFont(font, size)
    c.setFillColorRGB(*color)
    x = x_from_left(x_mm)
    y = y_from_top(y_mm_from_top)
    if align == "left":
        c.drawString(x, y, text)
    elif align == "center":
        c.drawCentredString(x, y, text)
    elif align == "right":
        c.drawRightString(x, y, text)


def draw_text_vcenter(c, x_mm, y1_mm, y2_mm, text, font=FONT_MINCHO, size=10.5, align="left"):
    """y1_mm〜y2_mm(上端からのmm)の範囲内で、上下中央に文字を描画する"""
    box_center = (y1_mm + y2_mm) / 2
    offset_mm = size * 0.3528 * 0.35  # フォントサイズに応じたベースライン補正
    draw_text(c, x_mm, box_center + offset_mm, text, font=font, size=size, align=align)

def rect(c, x1_mm, y1_mm, x2_mm, y2_mm, line_width=0.6):
    """左上(x1,y1)〜右下(x2,y2)の矩形を描く（mm・上端基準）"""
    c.setLineWidth(line_width)
    c.setStrokeColorRGB(0, 0, 0)
    x1 = x_from_left(x1_mm)
    x2 = x_from_left(x2_mm)
    y1 = y_from_top(y1_mm)
    y2 = y_from_top(y2_mm)
    c.rect(x1, y2, x2 - x1, y1 - y2, stroke=1, fill=0)


def hline(c, x1_mm, x2_mm, y_mm, line_width=0.5):
    c.setLineWidth(line_width)
    c.setStrokeColorRGB(0, 0, 0)
    c.line(x_from_left(x1_mm), y_from_top(y_mm), x_from_left(x2_mm), y_from_top(y_mm))


def vline(c, x_mm, y1_mm, y2_mm, line_width=0.5):
    c.setLineWidth(line_width)
    c.setStrokeColorRGB(0, 0, 0)
    c.line(x_from_left(x_mm), y_from_top(y1_mm), x_from_left(x_mm), y_from_top(y2_mm))


def wrap_text_by_width(c, text, font, size, max_width_mm):
    """日本語向けの簡易折り返し。1文字ずつ幅を測って max_width に収まるよう改行する"""
    max_width_pt = max_width_mm * mm
    lines = []
    for paragraph in text.split("\n"):
        current = ""
        for ch in paragraph:
            test = current + ch
            if pdfmetrics.stringWidth(test, font, size) > max_width_pt and current:
                lines.append(current)
                current = ch
            else:
                current = test
        lines.append(current)
    return lines


def draw_photo_box(c, x1_mm, y1_mm, x2_mm, y2_mm):
    """証明写真を、指定した枠内に収まるように（アスペクト比を保ったまま中央トリミングで）描画する"""
    rect(c, x1_mm, y1_mm, x2_mm, y2_mm, line_width=0.6)

    box_w_mm = x2_mm - x1_mm
    box_h_mm = y2_mm - y1_mm

    script_dir = os.path.dirname(os.path.abspath(__file__))
    photo_path = os.path.join(script_dir, PHOTO_FILENAME)

    if not os.path.exists(photo_path):
        # 写真が見つからない場合はプレースホルダーを表示するだけにする
        draw_text(
            c, (x1_mm + x2_mm) / 2, (y1_mm + y2_mm) / 2 - 2,
            "写真", font=FONT_GOTHIC, size=10, align="center"
        )
        draw_text(
            c, (x1_mm + x2_mm) / 2, (y1_mm + y2_mm) / 2 + 4,
            "(photo.jpg)", font=FONT_MINCHO, size=7, align="center"
        )
        return

    img = ImageReader(photo_path)
    img_w, img_h = img.getSize()
    img_ratio = img_w / img_h
    box_ratio = box_w_mm / box_h_mm

    # 枠を埋めるように中央トリミング（cover fit）
    if img_ratio > box_ratio:
        draw_h = box_h_mm
        draw_w = box_h_mm * img_ratio
    else:
        draw_w = box_w_mm
        draw_h = box_w_mm / img_ratio

    offset_x = x1_mm - (draw_w - box_w_mm) / 2
    offset_y = y1_mm - (draw_h - box_h_mm) / 2

    x = x_from_left(offset_x)
    y = y_from_top(offset_y + draw_h)
    c.saveState()
    p = c.beginPath()
    px1 = x_from_left(x1_mm)
    px2 = x_from_left(x2_mm)
    py1 = y_from_top(y1_mm)
    py2 = y_from_top(y2_mm)
    p.rect(px1, py2, px2 - px1, py1 - py2)
    c.clipPath(p, stroke=0, fill=0)
    c.drawImage(img, x, y, width=draw_w * mm, height=draw_h * mm,
                preserveAspectRatio=False, mask='auto')
    c.restoreState()


# ============================================================
#  ページ1：基本情報 ＋ 学歴・職歴（前半）
# ============================================================
def build_page1(c):
    LEFT, RIGHT = 15, 195  # ページ全体の左右端(mm)

    # ---- タイトル・作成日 ------------------------------------
    draw_text(c, LEFT, 22, "履　歴　書", font=FONT_GOTHIC, size=22)
    draw_text(c, RIGHT, 20, DOCUMENT_DATE_TEXT, font=FONT_MINCHO, size=10.5, align="right")

    # ---- 基本情報ボックスの外枠 -------------------------------
    HEADER_TOP = 30
    HEADER_BOTTOM = 105
    rect(c, LEFT, HEADER_TOP, RIGHT, HEADER_BOTTOM, line_width=0.8)

    PHOTO_X1, PHOTO_X2 = 163, 193
    PHOTO_Y1, PHOTO_Y2 = HEADER_TOP, 71
    LEFT_COL_RIGHT = PHOTO_X1  # 左側の情報列は写真の左端まで

    # 行の区切り(上端からの距離 mm)
    row_furigana_bottom = HEADER_TOP + 7          # 37
    row_name_bottom = row_furigana_bottom + 16    # 53
    row_birth_bottom = row_name_bottom + 9        # 62
    row_furigana_addr_bottom = 71                 # 写真の下端に揃える
    row_postal_bottom = row_furigana_addr_bottom + 5   # 80
    row_address_bottom = row_postal_bottom + 13         # 89
    row_contact_bottom = HEADER_BOTTOM                 # 116（電話・メール欄）

    # ---- ふりがな（氏名） --------------------------------------
    draw_text(c, LEFT + 3, HEADER_TOP + 4.5, "ふりがな", font=FONT_MINCHO, size=8)
    draw_text(c, LEFT + 22, HEADER_TOP + 4.5, FURIGANA_NAME, font=FONT_MINCHO, size=9)
    hline(c, LEFT, LEFT_COL_RIGHT, row_furigana_bottom)

    # ---- 氏名 ---------------------------------------------------
    draw_text(c, LEFT + 3, row_name_bottom - 10, "氏　名", font=FONT_MINCHO, size=8)
    draw_text(c, LEFT + 24, row_name_bottom - 5, FULL_NAME, font=FONT_GOTHIC, size=20)
    hline(c, LEFT, LEFT_COL_RIGHT, row_name_bottom)

    # ---- 生年月日・性別 -----------------------------------------
    draw_text(c, LEFT + 27, row_birth_bottom - 2.5, BIRTH_DATE_TEXT, font=FONT_MINCHO, size=10.5)
    hline(c, LEFT, LEFT_COL_RIGHT, row_birth_bottom)
    # 性別は写真の左側、生年月日行の続きに小さく記載
    draw_text(c, PHOTO_X1 - 32, row_birth_bottom - 6.5, "※性別", font=FONT_MINCHO, size=6.5)
    draw_text(c, PHOTO_X1 - 20, row_birth_bottom - 2.5, GENDER, font=FONT_MINCHO, size=9)

    # ---- 写真枠 ---------------------------------------------------
    draw_photo_box(c, PHOTO_X1, PHOTO_Y1, PHOTO_X2, PHOTO_Y2)

    # ---- ふりがな（住所） -----------------------------------------
    # 現住所の文字の上に元の通り罫線を描画
    hline(c, LEFT, RIGHT, row_furigana_addr_bottom)
    
    # ---- 現住所（郵便番号・ふりがな） -----------------------------
    # 「現住所 〒」を描画
    draw_text(c, LEFT + 3, row_postal_bottom - 1.7, "現住所　〒", font=FONT_MINCHO, size=9)
    # 郵便番号を描画
    draw_text(c, LEFT + 23, row_postal_bottom - 1.7, POSTAL_CODE, font=FONT_MINCHO, size=10)
    
    # 【移動】郵便番号の横に「ふりがな」を描画（X座標は適宜ご調整ください）
    draw_text(c, LEFT + 55, row_postal_bottom - 1.7, f"（ふりがな：{FURIGANA_ADDRESS}）", font=FONT_MINCHO, size=8)
    
    # 現住所の文字の下に元の通り罫線を描画
    hline(c, LEFT, RIGHT, row_postal_bottom)
    # ---- 現住所（番地） -------------------------------------------
    draw_text(c, LEFT + 25, row_address_bottom - 3, ADDRESS_LINE, font=FONT_MINCHO, size=18)
    hline(c, LEFT, RIGHT, row_address_bottom)


    # ================================================================
    # ★ 追加部分：電話番号／メールアドレス欄
    #   ・住所欄のすぐ下に新設
    #   ・上段＝電話番号、下段＝メールアドレスで、きれいに縦2分割
    #   ・文字を書いた側の右に縦罫線を引いて区切る
    #   ・その右側は空白のまま（今後の記入・変更用スペース）
    # ================================================================
    contact_mid = (row_address_bottom + row_contact_bottom) / 2  # 上下段の境界線
    divider_x = LEFT + 95  # 文字欄と余白欄を分ける縦罫線の位置

    # 上段・下段を分ける横線
    hline(c, LEFT, RIGHT, contact_mid)
    # 一番下の外枠との境目
    hline(c, LEFT, RIGHT, row_contact_bottom)

    # 上段：電話番号
    draw_text_vcenter(c, LEFT + 3, row_address_bottom, contact_mid, "電話番号", font=FONT_MINCHO, size=8)
    draw_text_vcenter(c, LEFT + 27, row_address_bottom, contact_mid, PHONE_NUMBER, font=FONT_MINCHO, size=10.5)

    # 下段：メールアドレス
    draw_text_vcenter(c, LEFT + 3, contact_mid, row_contact_bottom, "メールアドレス", font=FONT_MINCHO, size=8)
    draw_text_vcenter(c, LEFT + 27, contact_mid, row_contact_bottom, EMAIL_ADDRESS, font=FONT_MINCHO, size=10.5)
    # ================================================================

    # ---- 学歴・職歴 テーブル ---------------------------------------
    TABLE_TOP = HEADER_BOTTOM + 4  # 120
    TABLE_BOTTOM = 272
    col_year_w = 20
    col_month_w = 14
    col_year_x2 = LEFT + col_year_w
    col_month_x2 = col_year_x2 + col_month_w

    draw_gakureki_table(
        c,
        rows=GAKUREKI_SHOKUREKI,
        left=LEFT, right=RIGHT,
        col_year_x2=col_year_x2, col_month_x2=col_month_x2,
        table_top=TABLE_TOP, table_bottom=TABLE_BOTTOM,
        header_text="学　歴・職　歴（各別にまとめて書く）",
    )

    draw_text(c, (LEFT + RIGHT) / 2, 285, "1 / 2", font=FONT_MINCHO, size=8, align="center")


def draw_gakureki_table(c, rows, left, right, col_year_x2, col_month_x2,
                         table_top, table_bottom, header_text, header_row=True):
    """年・月・内容 の3列テーブルを描画する（学歴・職歴／免許・資格 共用）"""
    n_rows = len(rows) + (1 if header_row else 0)
    row_h = (table_bottom - table_top) / n_rows

    # 外枠
    rect(c, left, table_top, right, table_bottom, line_width=0.8)
    # 縦罫線
    vline(c, col_year_x2, table_top, table_bottom)
    vline(c, col_month_x2, table_top, table_bottom)

    y = table_top

    if header_row:
        draw_text(c, (left + col_year_x2) / 2, y + row_h / 2 + 1.8, "年",
                   font=FONT_MINCHO, size=9, align="center")
        draw_text(c, (col_year_x2 + col_month_x2) / 2, y + row_h / 2 + 1.8, "月",
                   font=FONT_MINCHO, size=9, align="center")
        draw_text(c, (col_month_x2 + right) / 2, y + row_h / 2 + 1.8, header_text,
                   font=FONT_MINCHO, size=9, align="center")
        y += row_h
        hline(c, left, right, y)

    for (year, month, text, kind) in rows:
        baseline = y + row_h / 2 + 1.8
        if kind == "section":
            draw_text(c, (col_month_x2 + right) / 2, baseline, text,
                       font=FONT_MINCHO, size=10, align="center")
        elif kind == "item":
            draw_text(c, (left + col_year_x2) / 2, baseline, year,
                       font=FONT_MINCHO, size=9.5, align="center")
            draw_text(c, (col_year_x2 + col_month_x2) / 2, baseline, month,
                       font=FONT_MINCHO, size=9.5, align="center")
            draw_text(c, col_month_x2 + 3, baseline, text, font=FONT_MINCHO, size=9.5)
        # blank行は何も書かない
        y += row_h
        if y < table_bottom - 0.01:
            hline(c, left, right, y)


# ============================================================
#  ページ2：学歴・職歴（続き）／免許・資格／志望の動機／本人希望記入欄
# ============================================================
def build_page2(c):
    LEFT, RIGHT = 15, 195

    TABLE1_TOP = 20
    TABLE1_BOTTOM = 60
    col_year_w = 20
    col_month_w = 14
    col_year_x2 = LEFT + col_year_w
    col_month_x2 = col_year_x2 + col_month_w

    draw_gakureki_table(
        c,
        rows=GAKUREKI_SHOKUREKI_PAGE2,
        left=LEFT, right=RIGHT,
        col_year_x2=col_year_x2, col_month_x2=col_month_x2,
        table_top=TABLE1_TOP, table_bottom=TABLE1_BOTTOM,
        header_text="学　歴・職　歴（各別にまとめて書く）",
        header_row=False,
    )

    # ---- 免許・資格 ---------------------------------------------
    TABLE2_TOP = TABLE1_BOTTOM + 6
    TABLE2_BOTTOM = TABLE2_TOP + (len(MENKYO_SHIKAKU) + 4) * 8.5

    menkyo_rows = [(y_, m_, t_, "item") for (y_, m_, t_) in MENKYO_SHIKAKU]
    menkyo_rows += [("", "", "", "blank")] * 3

    draw_gakureki_table(
        c,
        rows=menkyo_rows,
        left=LEFT, right=RIGHT,
        col_year_x2=col_year_x2, col_month_x2=col_month_x2,
        table_top=TABLE2_TOP, table_bottom=TABLE2_BOTTOM,
        header_text="免　許・資　格",
    )

    # ---- 志望動機／自己PR・自己研鑽（上下2分割） ----------------
    # ★ レイアウト案：同じ枠を上下2段に分け、上段＝志望動機、下段＝自己PR・自己研鑽
    #   として内容を明確に区別する。
    BOX3_TOP = TABLE2_BOTTOM + 6
    BOX3_BOTTOM = BOX3_TOP + 90
    SECTION_H = (BOX3_BOTTOM - BOX3_TOP) / 2   # 上下段それぞれの高さ（45mm）
    MID_Y = BOX3_TOP + SECTION_H                # 上下段の境界線

    # 外枠と、上下段を分ける中央の横罫線
    rect(c, LEFT, BOX3_TOP, RIGHT, BOX3_BOTTOM, line_width=0.8)
    hline(c, LEFT, RIGHT, MID_Y, line_width=0.8)

    # ---- 上段：志望動機 ----------------------------------------
    draw_text(c, LEFT + 3, BOX3_TOP + 6, "志望動機", font=FONT_MINCHO, size=9.5)
    hline(c, LEFT, RIGHT, BOX3_TOP + 9)

    motivation_lines = wrap_text_by_width(c, MOTIVATION_TEXT, FONT_MINCHO, 10.5, (RIGHT - LEFT) - 8)
    ty = BOX3_TOP + 17
    for line in motivation_lines:
        draw_text(c, LEFT + 4, ty, line, font=FONT_MINCHO, size=10.5)
        ty += 6.5

    # ---- 下段：自己PR・自己研鑽 ----------------------------------
    draw_text(c, LEFT + 3, MID_Y + 6, "自己PR・自己研鑽", font=FONT_MINCHO, size=9.5)
    hline(c, LEFT, RIGHT, MID_Y + 9)

    self_pr_lines = wrap_text_by_width(c, SELF_PR_TEXT, FONT_MINCHO, 10.5, (RIGHT - LEFT) - 8)
    ty2 = MID_Y + 17
    for line in self_pr_lines:
        draw_text(c, LEFT + 4, ty2, line, font=FONT_MINCHO, size=10.5)
        ty2 += 6.5

    # ---- 本人希望記入欄 -------------------------------------------
    BOX4_TOP = BOX3_BOTTOM + 6
    BOX4_BOTTOM = BOX4_TOP + 30
    rect(c, LEFT, BOX4_TOP, RIGHT, BOX4_BOTTOM, line_width=0.8)
    draw_text(c, LEFT + 3, BOX4_TOP + 6,
               "本人希望記入欄（特に給料・職種・勤務時間・勤務地・その他についての希望などがあれば記入）",
               font=FONT_MINCHO, size=10)
    hline(c, LEFT, RIGHT, BOX4_TOP + 9)
    
    request_lines = wrap_text_by_width(c, REQUEST_TEXT, FONT_MINCHO, 10.5, (RIGHT - LEFT) - 8)
    ty4 = BOX4_TOP + 14  # 開始のY座標
    for line in request_lines:
        draw_text(c, LEFT + 4, ty4, line, font=FONT_MINCHO, size=10.5)
        ty4 += 6.5       # 次の行のY座標をずらす（行間）

    draw_text(c, (LEFT + RIGHT) / 2, 285, "2 / 2", font=FONT_MINCHO, size=8, align="center")


# ============================================================
#  メイン処理
# ============================================================
def generate_resume():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, OUTPUT_FILENAME)

    c = canvas.Canvas(output_path, pagesize=A4)

    build_page1(c)
    c.showPage()

    build_page2(c)
    c.showPage()

    c.save()
    print(f"PDFを作成しました: {output_path}")


if __name__ == "__main__":
    generate_resume()