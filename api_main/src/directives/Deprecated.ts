import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils'
import { GraphQLSchema } from 'graphql'


export default function Deptrecated(directiveName: string) {
  return {
    deprecatedDirectiveTypeDefs: `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`,
    deprecatedDirectiveTransformer: (schema: GraphQLSchema) => mapSchema(schema, {
      [MapperKind.OBJECT_FIELD]: (fieldConfig) => {
        const deprecatedDirective = getDirective(schema, fieldConfig, directiveName)?.[0]
        if (deprecatedDirective) {
          fieldConfig.deprecationReason = deprecatedDirective.reason
          return fieldConfig
        }
        return fieldConfig
      },
      [MapperKind.ENUM_VALUE]: (enumValueConfig) => {
        const deprecatedDirective = getDirective(schema, enumValueConfig, directiveName)?.[0]
        if (deprecatedDirective) {
          enumValueConfig.deprecationReason = deprecatedDirective.reason
          return enumValueConfig
        }
        return enumValueConfig
      },
    }),
  }
}
