import SqlString from 'sqlstring'

/**
 * TODO extend and customize and use https://github.com/felixfbecker/node-sql-template-strings
 *
 */
const sql = (strs, ...substs): string => substs.reduce(
  (prev, cur, i) => prev + cur + strs[i + 1],
  strs[0],
)

/**
 * @param { any } value any value
 * @returns { string }
 */
export const escapePostgresql = (value) => {
  if (value === 'NOW()' || value === 'now()') // NOW() returned as-is, so that working with dates is easier
    return value

  if (typeof (value) === 'string') { // postgres strings are escaped with double quotes instead of backslash
    value = value.replace(/\\/gi, '\u{0004}')
    value = value.replace(/\f/gi, '\u{0005}')
    value = value.replace(/\n/gi, '\u{0007}')
    value = value.replace(/\r/gi, '\u{0011}')
    value = value.replace(/\t/gi, '\u{0012}')
    value = value.replace(/\v/gi, '\u{0013}')
    value = SqlString.escape(value)
    value = value.replace(/\\'/g, '\'\'')
    value = value.replace(/\u{0013}/giu, '\v')
    value = value.replace(/\u{0012}/giu, '\t')
    value = value.replace(/\u{0011}/giu, '\r')
    value = value.replace(/\u{0007}/giu, '\n')
    value = value.replace(/\u{0005}/giu, '\f')
    value = value.replace(/\u{0004}/giu, '\\')
    return 'E' + value
  }

  return SqlString.escape(value)
}

export default sql
